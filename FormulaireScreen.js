import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import formData from '../assets/Anyrequest.json';

const RatingIcons = {
  star: require('../assets/star.png'),
  heart: require('../assets/heart.png'),
  fire: require('../assets/fire.png'),
  number: {
    1: require('../assets/number_1.png'),
    2: require('../assets/number_2.png'),
    3: require('../assets/number_3.png'),
    4: require('../assets/number_4.png'),
    5: require('../assets/number_5.png'),
  },
  emoji: {
    1: require('../assets/emoji_1.png'),
    2: require('../assets/emoji_2.png'),
    3: require('../assets/emoji_3.png'),
    4: require('../assets/emoji_4.png'),
    5: require('../assets/emoji_5.png'),
  }
};

export default function FormulaireScreen() {
  const [responses, setResponses] = useState({});
  const [formQuestions, setFormQuestions] = useState([]);

  useEffect(() => {
    if (formData && formData.data && formData.data.questions) {
      setFormQuestions(formData.data.questions);
    }
  }, []);

  const handleSelect = (questionId, value) => {
    const question = formQuestions.find(q => q.questionId === questionId);
    if (!question) return;

    if (question.questionType === 'multipleChoice') {
      const previousValues = responses[questionId] || [];
      const valueExists = previousValues.includes(value);
      setResponses(prev => ({
        ...prev,
        [questionId]: valueExists ? previousValues.filter(v => v !== value) : [...previousValues, value]
      }));
    } else {
      setResponses(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const isSelected = (questionId, value) => {
    const response = responses[questionId];
    return Array.isArray(response) ? response.includes(value) : response === value;
  };

  const handleSubmit = () => {
    const formattedResponses = Object.entries(responses).map(([questionId, value]) => {
      const question = formQuestions.find(q => q.questionId === parseInt(questionId));
      return {
        questionId: parseInt(questionId),
        questionType: question?.questionType || '',
        value
      };
    });
    Alert.alert('Formulaire soumis', JSON.stringify(formattedResponses, null, 2));
  };

  const renderRatingQuestion = (question) => {
    const { questionId, questionDetails } = question;
    const { options } = questionDetails;
    let ratingType;
    switch (question.questionType) {
      case 'ratingStar': ratingType = 'star'; break;
      case 'ratingHeart': ratingType = 'heart'; break;
      case 'ratingFire': ratingType = 'fire'; break;
      case 'ratingNumber': ratingType = 'number'; break;
      case 'ratingEmojis': ratingType = 'emoji'; break;
      default: ratingType = 'star';
    }

    return (
      <View style={styles.ratingContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.ratingButton, isSelected(questionId, option.value) && styles.selectedRating]}
            onPress={() => handleSelect(questionId, option.value)}
          >
            <Image
              source={ratingType === 'emoji' || ratingType === 'number' ? RatingIcons[ratingType][option.value] : RatingIcons[ratingType]}
              style={styles.ratingIcon}
            />
            <Text style={styles.ratingText}>{option.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderQuestion = (question) => {
    const { questionId, questionType, questionDetails } = question;
    const { label, options } = questionDetails;

    switch (questionType) {
      case 'select':
        return (
          <View style={styles.dropdown}>
            <Picker
              selectedValue={responses[questionId] || ''}
              onValueChange={(itemValue) => handleSelect(questionId, itemValue)}
            >
              <Picker.Item label="Choisissez une option" value="" />
              {options.map((option, i) => (
                <Picker.Item key={i} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        );
      case 'multipleChoice':
        return (
          <View style={styles.choicesContainer}>
            {options.map((option, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.checkboxButton, isSelected(questionId, option.value) && styles.selectedCheckbox]}
                onPress={() => handleSelect(questionId, option.value)}
              >
                <View style={styles.checkbox}>
                  {isSelected(questionId, option.value) && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'singleChoice':
      case 'yesorno':
        return (
          <View style={styles.radioContainer}>
            {options.map((option, i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioButtonContainer}
                onPress={() => handleSelect(questionId, option.value)}
              >
                <View style={styles.radioOuter}>
                  {isSelected(questionId, option.value) && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'ratingStar':
      case 'ratingHeart':
      case 'ratingFire':
      case 'ratingNumber':
      case 'ratingEmojis':
        return renderRatingQuestion(question);
      default:
        return <Text style={styles.unsupportedText}>Type de question non supporté: {questionType}</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{formData.data.name || 'Formulaire'}</Text>
      <Text style={styles.description}>{formData.data.description || ''}</Text>
      {formQuestions.map((question, index) => (
        <View key={question.questionId} style={styles.questionBlock}>
          <Text style={styles.questionNumber}>Question {index + 1}</Text>
          <Text style={styles.label}>{question.questionDetails.label}</Text>
          {renderQuestion(question)}
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Soumettre</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    color: '#555',
    textAlign: 'center',
  },
  questionBlock: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginVertical: 5,
  },
  choicesContainer: {
    marginTop: 8,
  },
  checkboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#007bff',
    borderRadius: 2,
  },
  radioContainer: {
    marginTop: 8,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginVertical: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  ratingButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
  },
  selectedRating: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  ratingIconContainer: {
    alignItems: 'center',
  },
  ratingIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 12,
    color: '#555',
  },
  unsupportedText: {
    fontStyle: 'italic',
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  CircularProgress
} from '@mui/material';
import { saveAs } from 'file-saver';
import IndividualOrderForm from './IndividualOrderForm'; 

const AISection = ({ bakery, authData }) => {
  const [description, setDescription] = useState('');
  const [newPromt, setNewPromt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [canShow, setCanShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (bakery?.is_individual_order_avaliable && role === 'user') {
      setCanShow(true);
    }
  }, [bakery]);

  const base64toBlob = (base64, type) => {
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type });
  };

  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handleNewPromtChange = (event) => setNewPromt(event.target.value);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleEnterPress = (event) => {
    const isDescriptionField = event.target.name === 'description';
    const isNewPromptField = event.target.name === 'newPromt';
  
    if (event.key === 'Enter') {
      if (isDescriptionField && description.trim()) {
        handleButtonClick();
      } else if (isNewPromptField && newPromt.trim()) {
        handleEditClick();
      }
    }
  };

  const toggleOrderForm = () => {
    setShowOrderForm(!showOrderForm);
  };

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      const prompt = description;
  
      // Инструкция для проверки текста
      const mistralCheckInstruction = "Check whether the text entered below refers to confectionery. Return only YES or NO. Here is the given text: ";
  
      const checkPayload = {
        model: "mistral-large-latest",
        messages: [
          {
            role: "user",
            content: mistralCheckInstruction + description,
          },
        ],
      };
  
      // Запрос на проверку текста через Мистраль
      const checkResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer Hc8qiuEbJxPwSsQAneOHJPgn4xU8HDvd',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkPayload),
      });
  
      const checkData = await checkResponse.json();
  
      if (
        checkData &&
        checkData.choices &&
        checkData.choices.length > 0 &&
        checkData.choices[0].message.content.trim().toUpperCase() === "YES"
      ) {
  
        console.log(checkData.choices[0].message.content);
        // Если текст относится к кондитерским изделиям, продолжаем процесс перевода и генерации
        const mistralInstruction = "You need to translate the following text into English, return only the translation, if the original text is in English, leave the original. Now the text to be translated: ";
  
        const payloadMistral = {
          model: "mistral-large-latest",
          messages: [
            {
              role: "user",
              content: mistralInstruction + description,
            },
          ],
        };
  
        const responseMistral = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer Hc8qiuEbJxPwSsQAneOHJPgn4xU8HDvd',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payloadMistral),
        });
  
        const dataMistral = await responseMistral.json();
  
        if (dataMistral && dataMistral.choices && dataMistral.choices.length > 0) {
          const translatedText = dataMistral.choices[0].message.content;
  
          console.log(translatedText);
  
          const payload = {
            prompt: translatedText,
            steps: 30,
          };
  
          const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
  
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
  
          const data = await response.json();
          const imageBase64 = data.images[0];
  
          const blob = base64toBlob(imageBase64, 'image/png');
          setFile(blob);
          //saveAs(blob, 'image.png');
          setImageUrl(URL.createObjectURL(blob));
        } else {
          console.log("No valid response from Mistral API");
        }
      } else {
        // Если текст не относится к кондитерским изделиям, выводим уведомление
        //alert("Введённый текст не относится к кондитерским изделиям. Пожалуйста, уточните описание.");
         setSnackbarOpen(true);
      }
    }  catch (error) {
      console.error('Ошибка генерации изображения:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async () => {
    try {
      setLoading(true);
      const toBase64 = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
      });

      const imageBase64 = await toBase64(file);

      const mistralInstruction = "You need to translate the following text into English, return only the translation, if the original text is in English, leave the original. Now the text to be translated: ";

      const payloadMistral = {
          model: "mistral-large-latest",
          messages: [
              {
                  role: "user",
                  content: mistralInstruction + newPromt
              }
          ]
      };

      const responseMistral = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer Hc8qiuEbJxPwSsQAneOHJPgn4xU8HDvd',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payloadMistral)
      });

      const dataMistral = await responseMistral.json();

      if (dataMistral && dataMistral.choices && dataMistral.choices.length > 0) {
          const translatedPrompt = dataMistral.choices[0].message.content;
          console.log(translatedPrompt);

          const payload = {
              prompt: translatedPrompt,
              init_images: [imageBase64],
              steps: 30
          };

          const response = await fetch('http://127.0.0.1:7860/sdapi/v1/img2img', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              throw new Error(`Error ${response.status}: ${response.statusText}`);
          }

          const responseData = await response.json();
          const editedImageBase64 = responseData.images[0];

          const blob = base64toBlob(editedImageBase64, 'image/png');
          setFile(blob);
          //saveAs(blob, 'image.png');
          setImageUrl(URL.createObjectURL(blob));
      } else {
          console.log("No valid response from Mistral API");
      }
    } catch (error) {
      console.error('Ошибка редактирования изображения:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canShow) return null;

  return (
    <Box mt={6} display="flex" flexDirection="column" alignItems="center">
      <Card sx={{ maxWidth: 600, width: '100%', mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Не нашли нужный товар?
          </Typography>
          <Typography variant="body1" mb={2}>
            Приготовим заказ любой сложности по вашему описанию. Подтвердите эскиз, и мы рассчитаем стоимость в ближайшее время.
          </Typography>

          {!imageUrl && (
            <TextField
              fullWidth
              name="description"
              label="Описание"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Введите описание"
              margin="normal"
              onKeyDown={handleEnterPress} // Добавляем обработчик Enter
            />
          )}

          {imageUrl && (
            <>
              <CardMedia
                component="img"
                image={imageUrl}
                alt="Сгенерированное изображение"
                sx={{ height: 300, objectFit: 'contain', borderRadius: 2, mb: 2 }}
              />
              {!showOrderForm && (
                <TextField
                  fullWidth
                  label="Новое описание"
                  name="newPromt"
                  value={newPromt}
                  onChange={handleNewPromtChange}
                  placeholder="Введите желаемый результат"
                  margin="normal"
                  onKeyDown={handleEnterPress}
                />
              )}
            </>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" flexDirection="column" gap={2} mt={2}>
              {!imageUrl && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleButtonClick}
                  sx={{
                    backgroundColor: '#F0C422',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: '#E8BD20'
                    }
                  }}
                >
                  Получить результат
                </Button>
              )}
              {imageUrl && (
                <>
                  {!showOrderForm && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleEditClick}
                    sx={{
                      backgroundColor: '#F0C422',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: '#E8BD20'
                      }
                    }}
                  >
                    Отредактировать
                  </Button>
                )}
                  <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleOrderForm}
                        sx={{  marginTop: '1.5vh',  backgroundColor: '#F0C422',
                        transition: 'background-color 0.3s',
                            '&:hover': {
                            backgroundColor: '#E8BD20'
                    } }}
                    >
                        {showOrderForm ? 'Отмена' : 'Сформировать заказ'}
                    </Button>
                    {showOrderForm && (
                        <Box sx={{ marginTop: '1vh' }}>
                            <IndividualOrderForm />
                        </Box>
                    )}
                </>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Уведомления сверху по центру
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          Введённый текст не относится к кондитерским изделиям. Пожалуйста, уточните описание.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AISection;

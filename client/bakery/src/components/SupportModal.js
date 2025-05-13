import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, CircularProgress
} from '@mui/material';
import axios from '../api/axiosConfig';
import { toast } from 'react-toastify';

const SupportModal = ({ open, onClose, userRole, userId }) => {
    const [shortRequest, setShortRequest] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!shortRequest.trim() || !description.trim()) {
            toast.error('Пожалуйста, заполните все поля');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                short_request: shortRequest.trim(),
                description: description.trim(),
                status: 'на рассмотрении',
                ...(userRole === 'user' ? { userId } : { bakeryId: userId })
            };

            await axios.post('/api/technical-requests', payload); 
            toast.success('Обращение отправлено');
            onClose();
            setShortRequest('');
            setDescription('');
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при отправке обращения');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
        setShortRequest('');
        setDescription('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Обратиться в техподдержку</DialogTitle>
            <DialogContent>
                <TextField
                    label="Краткое обращение"
                    fullWidth
                    value={shortRequest}
                    onChange={(e) => setShortRequest(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    label="Описание проблемы"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} disabled={loading} sx={{
                            color:'white',
                            backgroundColor: '#F0C422',
                                transition: 'background-color 0.3s',
                                    '&:hover': {
                                    backgroundColor: '#E8BD20'
                            }
                        }}>
                    {loading ? <CircularProgress size={24} /> : 'Отправить'}
                </Button>
                <Button onClick={handleCancel} color="secondary">
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SupportModal;

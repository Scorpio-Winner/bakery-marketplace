const express = require('express');
const IndividualOrderController = require('../controllers/individualOrderController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/individualorders');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', authenticateToken, upload.single('photo'), IndividualOrderController.createIndividualOrder);

router.get('/', authenticateToken, IndividualOrderController.getUserIndiviudalOrders);

router.get('/:id', authenticateToken, IndividualOrderController.getIndividualOrderById);

router.put('/:id/status', authenticateToken, IndividualOrderController.updateIndividualOrderStatus);

router.put('/:id/completion-time', authenticateToken, IndividualOrderController.updateIndividualOrderCompletionTime);

router.put('/:id/total-cost', authenticateToken, IndividualOrderController.updateIndividualOrderTotalCost);

router.delete('/:id', authenticateToken, IndividualOrderController.deleteIndividualOrder);

module.exports = router;

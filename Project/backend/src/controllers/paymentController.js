import Payment from '../models/payment.js';

// Create Expense
export const createPayment = async (req, res) => {
  const { cardHolderName,cardType,expiryMonth, csv,itemname,cardn} = req.body;

  try {
    const expensee = new Payment({  cardHolderName,cardType,expiryMonth, csv,itemname,cardn});
    await expensee.save();
    res.status(201).json({ message: 'Expense created successfully', expensee });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All Expenses
export const getAllPayment = async (req, res) => {
  try {
    const expenses = await Payment.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Expense
export const updatePayment = async (req, res) => {
  const { iid } = req.params;
  const {cardHolderName,cardType,expiryMonth, csv,itemname,cardn} = req.body;

  try {
    const updatedExpense = await Payment.findByIdAndUpdate(iid, {cardHolderName,cardType,expiryMonth, csv,itemname ,cardn}, { new: true });
    res.status(200).json({ message: 'Expense updated successfully', updatedExpense });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Expense
export const deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    await Payment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




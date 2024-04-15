const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const validation = require("../utilities/validation");
//@desc Get all contacts
//@route GET /api/contacts
//@access public
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({});
  res.status(200).json(contacts);
});

//@desc Create New contact
//@route POST /api/contacts
//@access public
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is:", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: `All fields must present` });
  }
  const newContact = await new Contact({
    name,
    email,
    phone,
  });

  try {
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ error: "Failed to created contact" });
  }
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access public
const getContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!validation.isIdValidMongo(id)) {
    return res.status(400).json({ error: "Invalid contact ID format" });
  }
  const contact = await Contact.findById(id);

  if (!contact) {
    return res.status(404).json({ error: `Contact not found` });
  }
  res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!validation.isIdValidMongo(id)) {
    return res.status(400).json({ error: "Invalid contact ID format" });
  }

  const updates = req.body;

  const contact = await Contact.findByIdAndUpdate(id, updates, { new: true });

  if (!contact) {
    return res.status(404).json({ error: `Contact not found` });
  }
  res.status(200).json(contact);
});
//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!validation.isIdValidMongo(id)) {
    return res.status(400).json({ error: "Invalid contact ID format" });
  }
  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    return res.status(404).json({ error: `Contact not found` });
  }
  res.status(200).json({ message: "Contact deleted succesfully" });
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};

const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const validation = require("../utilities/validation");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Create New contact
//@route POST /api/contacts
//@access private
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
    user_id: req.user.id,
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
//@access private
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
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!validation.isIdValidMongo(id)) {
    return res.status(400).json({ error: "Invalid contact ID format" });
  }

  try {
    // Retrieve the contact from the database
    const contact = await Contact.findById(id);

    // Check if the contact exists
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // Check if the user has permission to update the contact
    if (contact.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        error: "User doesn't have permission to update other user contacts",
      });
    }

    // Proceed with updating the contact if user has permission
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Failed to update contact" });
  }
});
//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!validation.isIdValidMongo(id)) {
    return res.status(400).json({ error: "Invalid contact ID format" });
  }

  try {
    // Find the contact by ID and delete it
    const contact = await Contact.findByIdAndDelete(id);

    // Check if contact exists
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // Check if the user has permission to delete the contact
    if (contact.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        error: "User doesn't have permission to delete other user contacts",
      });
    }

    // If all checks pass, send success response
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    // Send error response
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};

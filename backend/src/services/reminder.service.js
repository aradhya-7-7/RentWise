const { sendEmail } = require("./email.service");

exports.sendRentReminder = async (email) => {
  await sendEmail(email, "Rent Reminder", "Your rent is due soon.");
};

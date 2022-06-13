const { I } = inject();

module.exports = {
  fields: {
    homenumber: 'input[id$="homePhoneNumber"]',
    mobilenumber: 'input[id$="mobilePhoneNumber"]'
  },
    EnterHomeAndMobileNo( homeNumber , mobileNumber ) {
        I.waitForText('Enter your home phone number');
        I.waitForText('Enter your mobile phone number');
        I.fillField(this.fields.homenumber, homeNumber );
        I.fillField(this.fields.mobilenumber, mobileNumber );
        I.click('Save and Continue')
        I.wait(5);
    },
};

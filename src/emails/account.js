const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const welcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dev.mjhossain@gmail.com',
        subject: 'Welcome to my API!',
        text: `Hi ${name}, hope you enjoy the services provided by this API!`
    })
}


const exitMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dev.mjhossain@gmail.com',
        subject: 'Hope you enjoyed our Service!',
        text: `Hi ${name}, hope you enjoyed the services provided by this API!`
    })
}


module.exports = {
    welcomeMail,
    exitMail
}
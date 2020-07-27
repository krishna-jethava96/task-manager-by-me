const sgMail=require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'krishnajethava96@gmail.com',
        subject:'Thanks for joinning!',
        text:`Welcome to the app ${ name }, let me know how you get along with the app`
    })
}

const sendCancelationEmail = (email,name) =>{
    sgMail.send({
        to: email,
        from: 'krishnajethava96@gmail.com',
        subject:'Sorry to see you go',
        text: ` Goodbye, ${ name }. I hope to see you again.`
    })
}
module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}
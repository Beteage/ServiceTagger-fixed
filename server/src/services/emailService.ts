import nodemailer from 'nodemailer';

// Generate test SMTP service account from ethereal.email
// Only needed once.
let testAccount: nodemailer.TestAccount;

export const sendJobAssignmentEmail = async (to: string, jobDetails: any) => {
    if (!testAccount) {
        testAccount = await nodemailer.createTestAccount();
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const info = await transporter.sendMail({
        from: '"ServiceTagger Dispatch" <dispatch@servicetagger.com>',
        to,
        subject: `New Job Assigned: ${jobDetails.customer.name}`,
        text: `You have been assigned a new job.\n\nCustomer: ${jobDetails.customer.name}\nAddress: ${jobDetails.customer.address}\nTime: ${jobDetails.scheduledStart}`,
        html: `
      <h2>New Job Assigned</h2>
      <p>You have been assigned a new job.</p>
      <ul>
        <li><strong>Customer:</strong> ${jobDetails.customer.name}</li>
        <li><strong>Address:</strong> ${jobDetails.customer.address}</li>
        <li><strong>Time:</strong> ${new Date(jobDetails.scheduledStart).toLocaleString()}</li>
      </ul>
      <p>Open the app to start travel.</p>
    `,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

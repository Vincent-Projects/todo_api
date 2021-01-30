# Log for the API

## 17 January, 2021

I start logging to get a journal of my thought throughout the development of this app, which i think will help me create real product.
I use Nodejs because i want to master Javascript i'm a believer in this technology and i needed a server side language. I discoverd about Nodejs month ago as well as it best framework, Expressjs.
Today i installed express-validor to secure the user input and help prevent from attack like man-in-the-middle attack. It'll handle check, sanitization, and validation.
I added validation with express-validator to the login middleware. And i added a server side error middleware to handle errors better ( til now it was only logging to the console the errors )
Today i implemented express-validator successfully for every routes that require data check for params and body. This api is a minimum valid.

## 30 January, 2021

I continue the log which i stopped for few weeks. Now i am implementing the best practices from the github repository nodejs best practice. I continue the log because i want to keep track of the choices i make during reading through those best practices.
I choose to wait 3 seconds before sending back the response while signup and the password is verifying. This is for preventing the timing attack even though i'm not sure this is 100% sure.
I decided to use express-rate-limit package so that each user ( IP adress ) would be block if they attempt to auth routes ( login , signup ... ) too many time during a short window of time.

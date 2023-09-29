# Restaurant Point of Sale (POS) System

**Author:** Mihai Culea

**University:** Solent University

**Year:** 2023

**Main POS:** https://ccwpos.web.app/  ( To access the order management system for the kitchen and bar, utilise this app. )

**Minified POS:** https://ccw-waiter.web.app/

**Customer App:** https://ccw-customer.web.app/


## Welcome to the Restaurant POS System Repository

Thank you for visiting this repository, which contains the code and documentation for my dissertation project. As a student, I've worked diligently on this project to create a comprehensive and efficient restaurant Point of Sale (POS) system.

## Project Overview

The Restaurant POS System is a web-based application developed to streamline restaurant operations. It consists of multiple branches, each dedicated to a specific part of the application:

- **`pos` Branch:** The main application, including the POS interface, clock-in system, authentication, table management, order management, payment processing, and admin UI.

- **`backend` Branch:** This branch contains the API endpoints, backend logic, database models, database management, and the machine learning dataset used for sales predictions.

- **`customer` Branch:** Similar to the main POS but tailored for customer interactions. It includes additional authentication methods, such as Google Auth, and handles payments before processing orders.

- **`pos-minified` Branch:** A minified version of the main POS app, with reduced functionality, including no clock-in system, simplified payment processing, and a more streamlined admin UI.

## Test Accounts


- **Pin: `111` :** This is one of the regular test accounts. This type of account would belong to waiters, bartenders and other roles involved in order management. For a more thorough testing, there are more accounts like this: `222`, `333`, `444`. 

- **Pin: `112` :** This is admin/management account. This type of account would belong to managers, supervisors, business owners who want to dive into management statistics, rota scheduling, pos users management, sales forcasting and others.
  
- **Pin: `01` :** This is login for the kitchen orders interface. This is just a broad example, if the business owner has separate sections in the kitchen this can be further broken down to only see the items for the specific cooking section.
  
- **Pin: `02` :** This is login for the bar orders interface. Similar concept to the kitchen login interface, but for drink.

- To test the clock in/out system, users simply put their pin and click on the Clock In/Out button instead of the Sign In.

## Getting Started

To install and run the project, please follow these steps:

1. Clone the repository to your local machine:

`git clone [repository URL]`


2. Navigate to the desired branch depending on the component you want to work with. For example, use the `pos` branch for the main POS application.

3. Install the necessary dependencies:

`npm install`


4. Start the application:

`npm run dev`

5. From the report, in Appendix 10 you will find archived the .env file of the specific branch to be copied into your cloned folder.

6. Access the application in your web browser at `http://localhost:5137`.

## Thank You

If you have any questions or suggestions, please feel free to [contact me](mailto:alemihai25@gmail.com). Your feedback is greatly appreciated!





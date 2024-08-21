## Overview
**Bambeo** is a web application designed to help users easily discover and manage grocery discounts. By aggregating offers from multiple retail chains, it allows users to search for deals, filter by product categories, and save their favorite items for quick access. This project was developed as part of my portfolio to showcase my full-stack development skills using modern technologies and best practices, with the aim of seeking employment in the IT industry.

### Live Demo
Explore the live demo of the project here: [https://bambeo.pl](https://bambeo.pl).

## Technology Stack
- **Frontend**:
  - **Framework**: Angular 15.2 with RxJS for reactive programming and state management
  - **Styling**: Tailwind CSS
  - **Architecture**: Modular Architecture for enhanced maintainability and scalability
- **Backend**:
  - **Platform**: C# .NET Core 7.0 Web API
  - **ORM**: Entity Framework Core
  - **Database**: SQL Server
  - **Architecture**: Layered Architecture (N-Tier Architecture) with adherence to SOLID principles for clean and scalable code
- **CI/CD**:
  - **Tools**: Integrated with GitHub Actions for continuous integration and deployment.
- **Deployment**:
  - **Hosting**: Deployed on Microsoft Azure, with the frontend as a Static Web App, the backend as an App Service, and SQL Server as a managed Azure SQL Database

## Key Features
- **Search and Filtering**: Quickly find discounted products by filtering through categories and stores, ensuring that users see only the most relevant offers.
- **Favorites List**: Users can save their favorite products, allowing them to easily monitor ongoing discounts on these items.
- **User Authentication**: Secure JWT-based authentication with features including user registration, password recovery via email, profile management, and account deletion.
- **Responsive Design**: The application provides a consistent user experience across devices, from desktops to smartphones.

## Next Steps
- **Admin Panel**: Develop an admin interface for managing products and discounts.
- **Saved Searches**: Implement functionality to save and reuse search queries.
- **Email Notifications**: Set up automatic email alerts for discounts on products users are subscribed to.
- **Caching**: Implement caching strategies on both server and client sides to improve performance, reduce database load, and enhance user experience.

## Contributing
Contributions are welcome! If you have suggestions for new features, encounter any bugs, or wish to enhance the codebase, feel free to open an issue or submit a pull request. Please ensure that your contributions adhere to the project's coding standards and best practices.

## License
This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/). You are free to share and adapt the material for non-commercial purposes, provided that appropriate credit is given, and any changes are indicated.

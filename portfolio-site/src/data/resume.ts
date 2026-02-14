import type { ResumeData } from "@/types/resume";

export const resumeData: ResumeData = {
  name: "PRAVARDHAN BHEEMAVARAPU",
  role: "Senior Full Stack Developer",
  tagline:
    "Senior Full Stack Developer with 6+ years of experience building enterprise applications across banking, insurance, and IT service management domains.",
  contact: {
    email: "pravardhanb17@gmail.com",
    phone: "+1(469)-892-8526",
    resumePath: "/PravardhanResume_SDE1.pdf",
  },
  experience: [
    {
      company: "Citi Bank",
      role: "Senior Java Developer",
      location: "Irving, TX",
      period: "01/2024 - Current",
      highlights: [
        "Led design and development of core backend modules for digital banking applications using Java 8+, Spring Boot, Spring MVC, and microservice architecture.",
        "Architected secure authentication flows with Spring Security and JWT to enable scalable role-based access.",
        "Built high-throughput transaction processing services with ACID-compliant MySQL transactions for transfers, payments, and account updates.",
        "Implemented event-driven processing with Apache Kafka and exposure to AWS SNS/SQS for asynchronous workflows.",
        "Containerized services with Docker and deployed on Kubernetes / AWS EKS while supporting CI/CD, observability, and production reliability.",
      ],
    },
    {
      company: "CHUBB",
      role: "Software Developer",
      location: "Hyderabad, Telangana",
      period: "03/2020 - 07/2023",
      highlights: [
        "Developed insurance administration modules with Java, Spring Boot, and Spring MVC to improve policy issuance and premium servicing workflows.",
        "Built RESTful APIs for policy creation, renewals, updates, and claims processing to reduce manual operations.",
        "Implemented end-to-end policy lifecycle management from underwriting approval through renewal and expiration.",
        "Optimized MySQL schema and SQL queries for policy, coverage, and claims data to improve response time.",
        "Added RBAC with Spring Security, audit logging, and rule-based validation frameworks to improve compliance and fraud detection.",
      ],
    },
    {
      company: "LTI Mindtree",
      role: "Full Stack Developer",
      location: "Hyderabad, Telangana",
      period: "02/2018 - 02/2020",
      highlights: [
        "Developed responsive UI screens using React, HTML5, CSS3, and JavaScript, improving page load time and reducing UI defects.",
        "Built and optimized backend services with Java, Spring Boot, and REST APIs to improve API response efficiency.",
        "Implemented secure authentication with Spring Security and JWT to reduce unauthorized access attempts.",
        "Designed normalized MySQL database structures to improve query performance and reduce redundancy.",
        "Created ticket lifecycle workflows and user dashboards with real-time metrics to improve SLA visibility and resolution efficiency.",
      ],
    },
  ],
  skills: [
    {
      category: "Programming",
      skills: ["Java", "JavaScript", "SQL", "Python", "Shell Scripting"],
    },
    {
      category: "Frontend",
      skills: ["React.js", "HTML5", "CSS3", "JavaScript ES6+", "Responsive UI Design"],
    },
    {
      category: "Backend",
      skills: ["Spring Boot", "Spring MVC", "Spring Security", "REST APIs", "Microservices", "Hibernate/JPA"],
    },
    {
      category: "Databases",
      skills: ["MySQL", "PostgreSQL", "Oracle", "Query Optimization", "Schema Design", "ACID Transactions"],
    },
    {
      category: "Messaging & Streaming",
      skills: ["Apache Kafka", "AWS SNS", "AWS SQS"],
    },
    {
      category: "Cloud & DevOps",
      skills: [
        "AWS (EC2, RDS, S3, Glacier, CloudWatch, Route 53, ALB, WAF, Lambda)",
        "AWS ECS",
        "AWS EKS",
        "Terraform",
        "CloudFormation",
        "Azure",
        "Docker",
        "Kubernetes",
        "Jenkins",
        "Git",
        "CI/CD",
      ],
    },
    {
      category: "Data Processing",
      skills: ["Kafka", "Spark", "Airflow", "ADF", "SSIS", "Informatica", "CDC", "ETL Pipelines"],
    },
    {
      category: "Tools & Platforms",
      skills: ["GitHub", "GitLab", "Maven", "Gradle", "Postman", "Swagger/OpenAPI"],
    },
    {
      category: "Testing",
      skills: ["JUnit", "Mockito", "API Testing", "Debugging", "Logging"],
    },
    {
      category: "Methodologies",
      skills: ["Agile/Scrum", "Sprint Planning", "JIRA", "Confluence", "Code Reviews"],
    },
    {
      category: "Observability",
      skills: ["Splunk", "AWS CloudWatch", "Grafana", "SignalFx"],
    },
    {
      category: "Security",
      skills: ["JWT", "RBAC", "Secure Coding", "OWASP Top 10", "Input Validation"],
    },
    {
      category: "BI & Reporting",
      skills: ["Power BI", "Tableau", "Excel Automation", "Data Modeling", "KPI Dashboards"],
    },
  ],
  education: [
    {
      institution: "The University of Texas at Arlington",
      degree: "Master of Science in Computer Science",
      location: "Arlington, Texas",
    },
    {
      institution: "Jawaharlal Nehru Technological University, Hyderabad",
      degree: "Bachelor's Degree",
      location: "Hyderabad, Telangana",
    },
  ],
};

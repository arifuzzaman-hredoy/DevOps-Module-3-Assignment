# ShopBondhu — AWS Networking & Web Hosting Assignment

![AWS](https://img.shields.io/badge/Cloud-AWS-orange)
![OS](https://img.shields.io/badge/OS-Ubuntu%2024.04-E95420)
![Web Server](https://img.shields.io/badge/Web%20Server-Nginx-009639)
![Status](https://img.shields.io/badge/Assignment-Completed-success)

## 1. Project Title & Short Description

**Project Name:** ShopBondhu — AWS Networking and Web Hosting

**Assignment:** Ostad — Basic Cloud & Linux, Module 3

This project demonstrates how to build a basic AWS network infrastructure and deploy a static website using an EC2 instance and Nginx.

The project was designed around a simple two-tier architecture:

* A public EC2 instance hosts the ShopBondhu frontend.
* A private EC2 instance represents the backend server.
* A NAT Gateway provides outbound internet access to the private subnet.
* An Internet Gateway provides internet connectivity to the public subnet.
* Separate route tables control traffic between public and private subnets.

The complete infrastructure was created, tested, documented, and successfully cleaned up after verification.

**AWS Region:** `ap-southeast-2` (Asia Pacific — Sydney)

---

## 2. Architecture Diagram

### 2.1 AWS Network Architecture

```text
                         INTERNET
                             |
                             |
                    Internet Gateway
                             |
                             |
                  +---------------------+
                  |     Public Route    |
                  |       Table         |
                  |  0.0.0.0/0 -> IGW   |
                  +---------------------+
                             |
                             |
              +--------------------------------+
              |          ShopBondhu VPC        |
              |           10.0.0.0/16          |
              |                                |
              |                                |
              |      PUBLIC SUBNET             |
              |       10.0.1.0/24              |
              |                                |
              |   +------------------------+   |
              |   |     Web EC2 Instance   |   |
              |   |     Ubuntu 24.04       |   |
              |   |     Nginx              |   |
              |   |     Frontend           |   |
              |   +------------------------+   |
              |                |               |
              |                |                |
              |          NAT Gateway            |
              |          (EIP attached)         |
              |                |                |
              |      PRIVATE ROUTE TABLE        |
              |       0.0.0.0/0 -> NAT          |
              |                |                |
              |                |                |
              |      PRIVATE SUBNET             |
              |       10.0.2.0/24              |
              |                                |
              |   +------------------------+   |
              |   |   Backend EC2 Instance |   |
              |   |   Ubuntu 24.04         |   |
              |   |   No Public IP         |   |
              |   +------------------------+   |
              |                                |
              +--------------------------------+
```

### 2.2 Traffic Flow

**Public EC2:**

```text
Internet
   |
Internet Gateway
   |
Public Route Table
   |
Public Subnet
   |
Web EC2 / Nginx
```

**Private EC2 outbound traffic:**

```text
Private EC2
   |
Private Route Table
   |
NAT Gateway
   |
Internet Gateway
   |
Internet
```

The private EC2 instance does not require a public IPv4 address to access the internet through the NAT Gateway.

---

## 3. AWS Resources Created

All resources were created in:

```text
Region: ap-southeast-2
```

### 3.1 VPC

| Property       | Value                 |
| -------------- | --------------------- |
| Name           | shopbondhu-vpc        |
| VPC ID         | vpc-0bbea6225dc5b7223 |
| IPv4 CIDR      | 10.0.0.0/16           |
| DNS Resolution | Enabled               |
| DNS Hostnames  | Disabled              |

### 3.2 Subnets

| Property               | Public Subnet            | Private Subnet            |
| ---------------------- | ------------------------ | ------------------------- |
| Name                   | shopbondhu-public-subnet | shopbondhu-private-subnet |
| Subnet ID              | subnet-0305ce6f9fd7bd515 | subnet-031a4d5212571e71e  |
| CIDR                   | 10.0.1.0/24              | 10.0.2.0/24               |
| Public IPv4 Assignment | Enabled                  | Disabled                  |
| Purpose                | Frontend hosting         | Backend hosting           |

### 3.3 Internet Gateway

| Property            | Value                 |
| ------------------- | --------------------- |
| Name                | shopbondhu-igw        |
| Internet Gateway ID | igw-074141909923c4f2e |
| Attached VPC        | shopbondhu-vpc        |

The Internet Gateway provided internet connectivity to the public subnet.

### 3.4 NAT Gateway

| Property          | Value                 |
| ----------------- | --------------------- |
| Name              | shopbondhu-nat        |
| NAT Gateway ID    | nat-0f40f69c6f07b75b8 |
| Connectivity Type | Public                |
| Elastic IP        | 13.239.178.20         |
| Private IPv4      | 10.0.1.17             |
| Subnet            | Public Subnet         |

The NAT Gateway allowed the private EC2 instance to access the internet without requiring a public IP address.

**Note:** The NAT Gateway and associated Elastic IP were deleted during final cleanup.

### 3.5 Route Tables

**Public Route Table**

| Destination | Target           |
| ----------- | ---------------- |
| 10.0.0.0/16 | local            |
| 0.0.0.0/0   | Internet Gateway |

Name: `shopbondhu-public-rt`

ID: `rtb-0001a46f0301926a6`

Associated subnet: Public Subnet.

**Private Route Table**

| Destination | Target      |
| ----------- | ----------- |
| 10.0.0.0/16 | local       |
| 0.0.0.0/0   | NAT Gateway |

Name: `shopbondhu-private-rt`

ID: `rtb-0b92032b86b55bb73`

Associated subnet: Private Subnet.

### 3.6 EC2 Instances

**Web Server**

| Property                 | Value                   |
| ------------------------ | ----------------------- |
| Name                     | shopbondhu-web          |
| Instance ID              | i-0f40ce28640ef1e8e     |
| Operating System         | Ubuntu Server 24.04 LTS |
| Instance Type            | t3.micro                |
| Private IP               | 10.0.1.183              |
| Public IP during testing | 3.107.58.102            |
| Subnet                   | Public Subnet           |
| Security Group           | shopbondhu-web-sg       |

**Backend Server**

| Property         | Value                   |
| ---------------- | ----------------------- |
| Name             | shopbondhu-backend      |
| Instance ID      | i-09f5cbacffafe03a5     |
| Operating System | Ubuntu Server 24.04 LTS |
| Instance Type    | t3.micro                |
| Private IP       | 10.0.2.73               |
| Public IP        | None                    |
| Subnet           | Private Subnet          |
| Security Group   | shopbondhu-backend-sg   |

### 3.7 Security Groups

**Web Security Group**

Name: `shopbondhu-web-sg`

| Type | Protocol | Port | Source                                |
| ---- | -------- | ---- | ------------------------------------- |
| HTTP | TCP      | 80   | 0.0.0.0/0                             |
| SSH  | TCP      | 22   | Authorized client public IP addresses |

**Backend Security Group**

Name: `shopbondhu-backend-sg`

| Type | Protocol | Port | Source            |
| ---- | -------- | ---- | ----------------- |
| SSH  | TCP      | 22   | shopbondhu-web-sg |

The backend SSH rule allowed administrative access through the public web server.

The backend instance did not have a public IP address.

---

## 4. Step-by-Step AWS Setup

### Step 1: Create a Custom VPC

Created a custom VPC with the following configuration:

```text
Name: shopbondhu-vpc
IPv4 CIDR: 10.0.0.0/16
Region: ap-southeast-2
```

DNS Resolution was enabled.

### Step 2: Create Public and Private Subnets

Created two subnets:

```text
Public Subnet:
10.0.1.0/24

Private Subnet:
10.0.2.0/24
```

Public subnet automatic public IPv4 assignment was enabled.

Private subnet automatic public IPv4 assignment was disabled.

### Step 3: Create and Attach Internet Gateway

Created:

```text
shopbondhu-igw
```

Attached it to:

```text
shopbondhu-vpc
```

### Step 4: Create NAT Gateway

Created a public NAT Gateway inside the public subnet.

Allocated an Elastic IP and associated it with the NAT Gateway.

This allowed private subnet instances to initiate outbound internet connections.

### Step 5: Configure Route Tables

Created two custom route tables.

Public route:

```text
Destination: 0.0.0.0/0
Target: Internet Gateway
```

Private route:

```text
Destination: 0.0.0.0/0
Target: NAT Gateway
```

Associated each route table with its respective subnet.

### Step 6: Launch EC2 Instances

Launched two Ubuntu EC2 instances.

**Web EC2:**

* Placed inside the public subnet.
* Assigned a public IPv4 address.
* Attached the web security group.

**Backend EC2:**

* Placed inside the private subnet.
* No public IPv4 address.
* Attached the backend security group.

### Step 7: Connect to the Public EC2

From WSL Ubuntu, connected to the public web server using SSH:

```bash
ssh -i "/path/to/shopbondhu-key.pem" ubuntu@WEB_PUBLIC_IP
```

Replace the key path and public IP with the actual values.

### Step 8: Connect to the Private EC2

Used SSH ProxyCommand to connect to the private backend through the public web server.

```bash
ssh -i "/path/to/shopbondhu-key.pem" \
-o IdentitiesOnly=yes \
-o ProxyCommand='ssh -i /path/to/shopbondhu-key.pem -o IdentitiesOnly=yes -W %h:%p ubuntu@WEB_PUBLIC_IP' \
ubuntu@10.0.2.73
```

This connection worked without assigning a public IP to the backend instance.

---

## 5. Nginx Installation & Frontend Deployment

### 5.1 Update Ubuntu Packages

Executed on the Web EC2:

```bash
sudo apt update
```

### 5.2 Install Nginx

```bash
sudo apt install nginx -y
```

### 5.3 Enable and Start Nginx

```bash
sudo systemctl enable --now nginx
```

### 5.4 Verify Nginx Service

```bash
sudo systemctl status nginx --no-pager
```

Expected result:

```text
Active: active (running)
```

### 5.5 Validate Nginx Configuration

```bash
sudo nginx -t
```

Expected result:

```text
syntax is ok
test is successful
```

### 5.6 Create Website Directory

```bash
sudo mkdir -p /var/www/shopbondhu
```

### 5.7 Deploy Frontend Files

The frontend contains:

```text
frontend/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

Deployed files to:

```text
/var/www/shopbondhu/
```

Final server directory:

```text
/var/www/shopbondhu/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

### 5.8 Configure Nginx Server Block

Created:

```bash
sudo nano /etc/nginx/sites-available/shopbondhu
```

Configuration:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name _;

    root /var/www/shopbondhu;
    index index.html;

    access_log /var/log/nginx/shopbondhu_access.log;
    error_log /var/log/nginx/shopbondhu_error.log;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(css|js)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

### 5.9 Enable the Website Configuration

```bash
sudo ln -s /etc/nginx/sites-available/shopbondhu \
/etc/nginx/sites-enabled/shopbondhu
```

Removed the default Nginx site:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 5.10 Test and Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5.11 Verify Website Locally

```bash
curl -I http://localhost
```

Expected result:

```text
HTTP/1.1 200 OK
```

### 5.12 Verify Frontend Assets

```bash
curl -I http://localhost/css/style.css
curl -I http://localhost/js/script.js
```

Both assets returned HTTP 200.

### 5.13 Access Website from Browser

During testing, the website was accessible using:

```text
http://3.107.58.102/
```

The public IP above was the temporary EC2 public IP during testing. It is no longer active because the EC2 instance has been terminated.

---

## 6. NAT Gateway Connectivity Test

One of the main objectives was to verify that a private EC2 instance could access the public internet through a NAT Gateway.

### 6.1 Verify Private Instance Network

Executed on the Backend EC2:

```bash
hostname
hostname -I
```

Observed private IP:

```text
10.0.2.73
```

The backend instance had no public IPv4 address.

### 6.2 Check Outbound Public IPv4

```bash
curl -4 --connect-timeout 10 \
https://checkip.amazonaws.com
```

Observed output:

```text
13.239.178.20
```

This matched the Elastic IP associated with the NAT Gateway.

### 6.3 Verify DNS Resolution

```bash
getent hosts google.com
```

Google's hostname resolved successfully.

### 6.4 Verify HTTPS Connectivity

```bash
curl -I --connect-timeout 10 \
https://www.google.com
```

Observed result:

```text
HTTP/2 200
```

### 6.5 Test Result

| Test                     | Result        |
| ------------------------ | ------------- |
| Backend private IP       | 10.0.2.73     |
| Backend public IP        | None          |
| DNS resolution           | Successful    |
| Outbound HTTPS           | Successful    |
| Observed public IPv4     | 13.239.178.20 |
| NAT Gateway connectivity | Successful    |

**Conclusion:** The private EC2 instance successfully accessed the internet through the NAT Gateway without requiring a public IPv4 address.

---

## 7. Troubleshooting Questions

### Question 1: The website is not opening in the browser, but SSH is working. What could be wrong?

Possible causes:

1. **HTTP port 80 is blocked**

   * Check the Web EC2 Security Group.
   * Ensure inbound TCP port 80 is allowed from the intended clients.

2. **Nginx is not running**

   * Check:

   ```bash
   sudo systemctl status nginx
   ```

   * Start it if necessary:

   ```bash
   sudo systemctl start nginx
   ```

3. **Nginx configuration contains an error**

   ```bash
   sudo nginx -t
   ```

4. **Incorrect website document root**

   * Verify that the website files exist under:

   ```text
   /var/www/shopbondhu/
   ```

5. **Incorrect public IP or routing**

   * Verify the EC2 public IP.
   * Check the public subnet route table.
   * Ensure the default route points to the Internet Gateway.

6. **Nginx access or error logs**

   ```bash
   sudo tail -f /var/log/nginx/shopbondhu_access.log
   sudo tail -f /var/log/nginx/shopbondhu_error.log
   ```

### Question 2: The backend EC2 cannot run `sudo apt update`. It hangs. What could be wrong?

Possible causes:

1. NAT Gateway is not in the public subnet.
2. NAT Gateway does not have an associated Elastic IP.
3. NAT Gateway is not in the Available state.
4. Private route table does not have the correct default route.
5. Private subnet is associated with the wrong route table.
6. DNS resolution is not working.
7. Network connectivity is blocked by an incorrect security configuration.

Useful verification commands:

```bash
ip route
```

```bash
getent hosts archive.ubuntu.com
```

```bash
curl -I --connect-timeout 10 https://www.google.com
```

Check the private route table:

```text
0.0.0.0/0 -> NAT Gateway
```

Check that the NAT Gateway is available and has a valid Elastic IP.

---

## 8. Cleanup

After completing the assignment and collecting the required evidence, all assignment-related AWS resources were successfully cleaned up.

### 8.1 Cleanup Checklist

* [x] NAT Gateway deleted.
* [x] Elastic IP released.
* [x] Web EC2 instance terminated.
* [x] Backend EC2 instance terminated.
* [x] Public Route Table deleted.
* [x] Private Route Table deleted.
* [x] Internet Gateway detached and deleted.
* [x] Public Subnet deleted.
* [x] Private Subnet deleted.
* [x] Web Security Group deleted.
* [x] Backend Security Group deleted.
* [x] Custom VPC deleted.
* [x] No unattached EBS Volumes remaining.
* [x] No assignment-related EBS Snapshots remaining.

**Cleanup Status: COMPLETED**

The deployed website and AWS networking environment are no longer active.

The cleanup was performed after completing the assignment tests and saving the documentation and screenshots.

---

## 9. What I Learned

Through this assignment, I gained practical experience with AWS networking, Linux administration, EC2 management, and web hosting.

### AWS Networking

* Creating and configuring a custom VPC.
* Understanding IPv4 CIDR blocks.
* Creating public and private subnets.
* Understanding public and private network architecture.
* Attaching an Internet Gateway.
* Configuring a NAT Gateway.
* Understanding Elastic IP addresses.
* Creating and associating custom route tables.
* Understanding route table entries and default routes.
* Configuring Security Groups.

### EC2 & Linux Administration

* Launching Ubuntu EC2 instances.
* Connecting to EC2 through SSH.
* Connecting to a private EC2 through a public EC2.
* Managing Linux packages with APT.
* Checking network interfaces and IP addresses.
* Managing Linux services with systemctl.
* Verifying connectivity using curl and other networking commands.

### Web Server & Deployment

* Installing and configuring Nginx.
* Creating a custom Nginx server block.
* Deploying a static frontend.
* Configuring website document roots.
* Serving HTML, CSS, and JavaScript files.
* Verifying HTTP responses.
* Checking Nginx logs.

### DevOps Concepts

* Understanding public and private infrastructure.
* Applying network segmentation.
* Restricting SSH access through Security Groups.
* Understanding outbound internet access through NAT.
* Using a bastion-style SSH connection.
* Troubleshooting connectivity issues.
* Documenting infrastructure and deployment steps.
* Cleaning up AWS resources to avoid unnecessary charges.

---

## 10. Project Structure

```text
shopbondhu-aws-assignment/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── screenshots/
│   ├── 01-vpc.png
│   ├── 02-subnets.png
│   ├── 03-igw-attached.png
│   ├── 04-nat-gateway.png
│   ├── 05-public-rt.png
│   ├── 06-private-rt.png
│   ├── 07-web-ec2.png
│   ├── 08-backend-ec2.png
│   ├── 09-backend-security-group.png
│   ├── 09-web-security-group.png
│   ├── 10-nginx-running.png
│   ├── 11-shopbondhu-website.png
│   └── 12-nat-connectivity-test.png
│
├── server-history/
│   ├── web-server-history.md
│   └── backend-server-history.md
│
├── commands.md
├── README.md
└── .gitignore
```

**Note:** The `screenshots/` directory also contains additional website verification screenshots. The list above highlights the main evidence files.

---

## 11. Evidence & Screenshots

The `screenshots/` directory contains visual evidence of the assignment implementation.

| Screenshot                    | Evidence                          |
| ----------------------------- | --------------------------------- |
| 01-vpc.png                    | Custom VPC                        |
| 02-subnets.png                | Public and Private Subnets        |
| 03-igw-attached.png           | Internet Gateway attachment       |
| 04-nat-gateway.png            | NAT Gateway                       |
| 05-public-rt.png              | Public Route Table                |
| 06-private-rt.png             | Private Route Table               |
| 07-web-ec2.png                | Public Web EC2                    |
| 08-backend-ec2.png            | Private Backend EC2               |
| 09-backend-security-group.png | Backend Security Group            |
| 09-web-security-group.png     | Web Security Group                |
| 10-nginx-running.png          | Nginx service verification        |
| 11-shopbondhu-website.png     | Deployed ShopBondhu website       |
| 12-nat-connectivity-test.png  | Private EC2 NAT connectivity test |

The server history directory contains the saved Bash history and supporting activity documentation for both EC2 instances.

---

## 12. GitHub Repository

The complete assignment documentation, frontend source code, command reference, server history, and screenshots are available in the GitHub repository.

**Repository:**

https://github.com/arifuzzaman-hredoy/DevOps-Module-3-Assignment

### Git Commits

The project was organized into meaningful commits:

```text
docs: add AWS architecture and setup documentation

feat: add ShopBondhu static frontend

docs: add deployment evidence and server command history
```

---

## 13. Final Project Status

| Task                          | Status    |
| ----------------------------- | --------- |
| Custom VPC                    | Completed |
| Public and Private Subnets    | Completed |
| Internet Gateway              | Completed |
| NAT Gateway                   | Completed |
| Route Tables                  | Completed |
| EC2 Instances                 | Completed |
| Security Groups               | Completed |
| Nginx Installation            | Completed |
| Frontend Deployment           | Completed |
| NAT Connectivity Test         | Passed    |
| Troubleshooting Documentation | Completed |
| Screenshots and Evidence      | Completed |
| Server History Documentation  | Completed |
| GitHub Push                   | Completed |
| AWS Resource Cleanup          | Completed |

**Overall Assignment Status: COMPLETED**

---

**Project:** ShopBondhu — AWS Networking & Web Hosting
**Course:** Ostad — Basic Cloud & Linux
**Module:** Module 3
**Region:** AWS Asia Pacific (Sydney) — `ap-southeast-2`
**Status:** Successfully Implemented, Tested, Documented & Cleaned Up.

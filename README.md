# ShopBondhu — AWS Networking & Web Hosting Assignment

## 1. Project Title & Short Description

**Project Name:** ShopBondhu — AWS Networking and Web Hosting

**Project Type:** AWS Cloud Infrastructure and DevOps Practice Project

**Objective:**

The objective of this project is to design and deploy a basic cloud infrastructure on AWS using a custom VPC, public and private subnets, Internet Gateway, NAT Gateway, EC2 instances, Security Groups, Route Tables, and Nginx.

A static e-commerce frontend named ShopBondhu is deployed on a public EC2 instance. A separate backend EC2 instance is deployed inside a private subnet without a Public IPv4 address.

The private backend accesses the Internet through a NAT Gateway.

**AWS Region:** `ap-southeast-2` (Asia Pacific — Sydney)

---

## 2. Architecture Diagram

```text
                         INTERNET
                            |
                            |
                    Internet Gateway
                            |
                  ---------------------
                  |                   |
                  |                   |
             PUBLIC SUBNET        NAT GATEWAY
             10.0.1.0/24          Public IP:
                  |               13.239.178.20
                  |                   |
             Web EC2                  |
             shopbondhu-web           |
             10.0.1.183               |
             Public IP:               |
             3.107.58.102             |
                  |                   |
                  |                   |
             Nginx Server             |
             Port 80                  |
                  |                   |
             ShopBondhu               |
             Frontend                 |
                                      |
                                      |
                              PRIVATE SUBNET
                              10.0.2.0/24
                                      |
                                Backend EC2
                                10.0.2.73
                                No Public IP
                                      |
                                      |
                               Private Route Table
                               0.0.0.0/0 -> NAT
```

**Network Flow:**

* Public EC2 receives HTTP requests through the Internet Gateway.
* Nginx serves the ShopBondhu frontend.
* Backend EC2 remains inside the private subnet.
* Backend EC2 does not have a Public IPv4 address.
* Outbound Internet traffic from the backend is routed through the NAT Gateway.

---

## 3. Resources Created

### VPC

| Property | Value                 |
| -------- | --------------------- |
| Name     | shopbondhu-vpc        |
| VPC ID   | vpc-0bbea6225dc5b7223 |
| CIDR     | 10.0.0.0/16           |
| Region   | ap-southeast-2        |

### Subnets

| Subnet  | CIDR        | Subnet ID                | Purpose        |
| ------- | ----------- | ------------------------ | -------------- |
| Public  | 10.0.1.0/24 | subnet-0305ce6f9fd7bd515 | Web Server     |
| Private | 10.0.2.0/24 | subnet-031a4d5212571e71e | Backend Server |

### Internet Gateway

| Property     | Value                 |
| ------------ | --------------------- |
| Name         | shopbondhu-igw        |
| Gateway ID   | igw-074141909923c4f2e |
| Attached VPC | shopbondhu-vpc        |

### NAT Gateway

| Property             | Value                 |
| -------------------- | --------------------- |
| Name                 | shopbondhu-nat        |
| Gateway ID           | nat-0f40f69c6f07b75b8 |
| Connectivity         | Public                |
| Public IP            | 13.239.178.20         |
| Private IP           | 10.0.1.17             |
| Subnet               | Public Subnet         |
| State during testing | Available             |

### Route Tables

**Public Route Table**

* Name: `shopbondhu-public-rt`
* ID: `rtb-0001a46f0301926a6`
* Associated Subnet: Public Subnet

| Destination | Target           |
| ----------- | ---------------- |
| 10.0.0.0/16 | local            |
| 0.0.0.0/0   | Internet Gateway |

**Private Route Table**

* Name: `shopbondhu-private-rt`
* ID: `rtb-0b92032b86b55bb73`
* Associated Subnet: Private Subnet

| Destination | Target      |
| ----------- | ----------- |
| 10.0.0.0/16 | local       |
| 0.0.0.0/0   | NAT Gateway |

### EC2 Instances

**Web Server**

| Property                 | Value                   |
| ------------------------ | ----------------------- |
| Name                     | shopbondhu-web          |
| Instance ID              | i-0f40ce28640ef1e8e     |
| Instance Type            | t3.micro                |
| Operating System         | Ubuntu Server 24.04 LTS |
| Private IP               | 10.0.1.183              |
| Public IP during testing | 3.107.58.102            |
| Subnet                   | Public Subnet           |
| Security Group           | shopbondhu-web-sg       |

**Backend Server**

| Property         | Value                   |
| ---------------- | ----------------------- |
| Name             | shopbondhu-backend      |
| Instance ID      | i-09f5cbacffafe03a5     |
| Instance Type    | t3.micro                |
| Operating System | Ubuntu Server 24.04 LTS |
| Private IP       | 10.0.2.73               |
| Public IP        | None                    |
| Subnet           | Private Subnet          |
| Security Group   | shopbondhu-backend-sg   |

### Security Groups

**shopbondhu-web-sg**

* HTTP — TCP 80 — `0.0.0.0/0`
* SSH — TCP 22 — restricted to permitted administrator public IP addresses.

**shopbondhu-backend-sg**

* SSH — TCP 22 — Source: `shopbondhu-web-sg`
* Outbound traffic — Default allow-all rule.

---

## 4. Step-by-Step Setup

### Step 1: Create a Custom VPC

Created a custom VPC named `shopbondhu-vpc` with CIDR:

```text
10.0.0.0/16
```

DNS resolution was enabled.

### Step 2: Create Public and Private Subnets

Created two subnets:

```text
Public Subnet:  10.0.1.0/24
Private Subnet: 10.0.2.0/24
```

Enabled automatic Public IPv4 assignment for the public subnet and disabled it for the private subnet.

### Step 3: Create and Attach Internet Gateway

Created `shopbondhu-igw` and attached it to the custom VPC.

### Step 4: Create NAT Gateway

Created a public NAT Gateway inside the public subnet and associated an Elastic IP.

The NAT Gateway was used to provide outbound Internet connectivity to the private subnet.

### Step 5: Configure Route Tables

Configured the public route table to route Internet-bound traffic through the Internet Gateway.

Configured the private route table to route Internet-bound traffic through the NAT Gateway.

### Step 6: Launch EC2 Instances

Launched two Ubuntu 24.04 LTS instances:

* Public Web EC2
* Private Backend EC2

Configured Security Groups according to their roles.

### Step 7: Connect to the Web Server

Connected to the public EC2 instance using SSH.

Installed and enabled Nginx.

### Step 8: Connect to the Private Backend

Used the Web EC2 instance as an SSH jump host to access the private backend.

The private backend was accessed through its private IPv4 address.

---

## 5. Nginx & Frontend Deployment

### Install Nginx

Executed on the Web EC2 instance:

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable --now nginx
```

Verified the Nginx service:

```bash
sudo systemctl status nginx --no-pager
sudo nginx -t
curl -I http://localhost
```

### Deploy Frontend

Created the application directory:

```bash
s
```

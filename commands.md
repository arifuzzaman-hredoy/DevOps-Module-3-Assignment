# ShopBondhu — AWS & Linux Commands Reference

This document contains the important commands used during the ShopBondhu AWS Networking and Web Hosting assignment.

## 1. Local WSL Ubuntu Commands

### SSH Key Permission

```bash
chmod 400 /mnt/c/Users/USER/Downloads/shopbondhu-key.pem
```

### Connect to Public Web EC2

```bash
ssh -i "/mnt/c/Users/USER/Downloads/shopbondhu-key.pem" ubuntu@WEB_PUBLIC_IP
```

### Connect to Private Backend EC2 Through Web EC2

```bash
ssh -i "/mnt/c/Users/USER/Downloads/shopbondhu-key.pem" \
-o IdentitiesOnly=yes \
-o ProxyCommand='ssh -i /mnt/c/Users/USER/Downloads/shopbondhu-key.pem -o IdentitiesOnly=yes -W %h:%p ubuntu@WEB_PUBLIC_IP' \
ubuntu@10.0.2.73
```

### Copy Files from Web EC2

```bash
scp -i "/mnt/c/Users/USER/Downloads/shopbondhu-key.pem" \
-o ProxyCommand='ssh -i /mnt/c/Users/USER/Downloads/shopbondhu-key.pem -o IdentitiesOnly=yes -W %h:%p ubuntu@WEB_PUBLIC_IP' \
ubuntu@10.0.1.183:/var/www/shopbondhu/index.html frontend/index.html
```

## 2. Web EC2 — Linux & Nginx Commands

### Update Package Repository

```bash
sudo apt update
```

### Install Nginx

```bash
sudo apt install nginx -y
```

### Enable and Start Nginx

```bash
sudo systemctl enable --now nginx
```

### Check Nginx Status

```bash
sudo systemctl status nginx --no-pager
```

### Test Nginx Configuration

```bash
sudo nginx -t
```

### Reload Nginx

```bash
sudo systemctl reload nginx
```

### Create Website Directories

```bash
sudo mkdir -p /var/www/shopbondhu/{css,js}
```

### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/shopbondhu
```

### Enable Website

```bash
sudo ln -s /etc/nginx/sites-available/shopbondhu \
/etc/nginx/sites-enabled/shopbondhu
```

### Disable Default Website

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### Verify Website

```bash
curl -I http://localhost
```

### Verify CSS

```bash
curl -I http://localhost/css/style.css
```

### Verify JavaScript

```bash
curl -I http://localhost/js/script.js
```

### Display HTML Content

```bash
curl -s http://localhost | head -20
```

### Inspect Nginx Logs

```bash
sudo tail -f /var/log/nginx/shopbondhu_access.log
sudo tail -f /var/log/nginx/shopbondhu_error.log
```

## 3. Backend EC2 — Private Network Commands

### Verify Hostname

```bash
hostname
```

### Verify Private IP

```bash
hostname -I
```

### Inspect IPv4 Network Interfaces

```bash
ip -4 addr show
```

### Test NAT Gateway Public IP

```bash
curl -4 --connect-timeout 10 https://checkip.amazonaws.com
```

### Test DNS Resolution

```bash
getent hosts google.com
```

### Test HTTPS Connectivity

```bash
curl -I --connect-timeout 10 https://www.google.com
```

### Test Ubuntu Repository DNS

```bash
getent hosts archive.ubuntu.com
```

### Update Package Repository

```bash
sudo apt update
```

## 4. Linux Troubleshooting Commands

### Check Running Services

```bash
systemctl --type=service --state=running
```

### Check Disk Usage

```bash
df -h
```

### Check Memory Usage

```bash
free -h
```

### Check CPU and Processes

```bash
top
```

### Check Network Routes

```bash
ip route
```

### Check Listening Ports

```bash
sudo ss -tulpn
```

### Inspect Recent System Logs

```bash
sudo journalctl -xe
```

## 5. Important AWS Networking Concepts

| Component        | Purpose                                                                   |
| ---------------- | ------------------------------------------------------------------------- |
| VPC              | Isolated virtual network                                                  |
| Public Subnet    | Subnet with a route to an Internet Gateway                                |
| Private Subnet   | Subnet without a direct Internet Gateway route                            |
| Internet Gateway | Enables Internet connectivity for eligible public-subnet resources        |
| NAT Gateway      | Allows private-subnet resources to initiate outbound Internet connections |
| Route Table      | Controls network traffic routing                                          |
| Security Group   | Stateful virtual firewall for EC2 instances                               |
| Elastic IP       | Static public IPv4 address                                                |

## 6. Important Security Notes

* Never upload `.pem` private keys to GitHub.
* Never commit AWS access keys or passwords.
* Restrict SSH access to trusted source IP addresses or use a managed access method such as AWS Systems Manager Session Manager.
* Keep backend instances in private subnets.
* Delete unused NAT Gateways and release unused Elastic IPs to avoid unnecessary AWS charges.

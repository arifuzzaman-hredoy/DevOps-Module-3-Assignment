# ShopBondhu — Backend Server Command History

## Server Information

* Server Name: shopbondhu-backend
* Hostname: ip-10-0-2-73
* Private IP: 10.0.2.73
* Public IP: None
* Operating System: Ubuntu Server 24.04.5 LTS
* Network: Private Subnet (10.0.2.0/24)

## Original Bash History

The following commands were collected from the Backend EC2 instance using `history` and `~/.bash_history`.

```bash
clear
hostname
hostname -I
ip -4 addr show
clear
curl -4 --connect-timeout 10 https://checkip.amazonaws.com
getent hosts google.com
curl -I --connect-timeout 10 https://www.google.com
clear
hostname -I
curl -4 https://checkip.amazonaws.com
getent hosts google.com
curl -I https://www.google.com
exit
```

## NAT Gateway Connectivity Verification

### 1. Private IP Verification

The backend server was verified to have private IP address:

`10.0.2.73`

### 2. Public IP Verification

Command:

```bash
curl -4 --connect-timeout 10 https://checkip.amazonaws.com
```

Expected observed output:

```text
13.239.178.20
```

This IP matches the NAT Gateway's Elastic IP.

### 3. DNS Resolution

Command:

```bash
getent hosts google.com
```

DNS resolution was successful.

### 4. HTTPS Connectivity

Command:

```bash
curl -I --connect-timeout 10 https://www.google.com
```

Observed HTTP response:

```text
HTTP/2 200
```

## Verification Result

* Backend EC2 has no public IPv4 address.
* Backend EC2 uses the private subnet.
* DNS resolution works.
* Outbound internet connectivity works through the NAT Gateway.
* The observed outbound public IPv4 address matches the NAT Gateway Elastic IP.

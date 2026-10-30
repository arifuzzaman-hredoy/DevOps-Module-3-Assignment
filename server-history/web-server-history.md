# ShopBondhu — Web Server Command History

## Server Information

* Server Name: shopbondhu-web
* Hostname: ip-10-0-1-183
* Private IP: 10.0.1.183
* Public IP during testing: 3.107.58.102
* Operating System: Ubuntu Server 24.04 LTS
* Web Server: Nginx

## Original Bash History

The following commands were collected from the Web EC2 instance using `history` and `~/.bash_history`.

```bash
whoami
hostname
hostname -I
clear
sudo apt update
sudo apt install nginx -y
sudo systemctl enable --now nginx
sudo systemctl status nginx --no-pager
sudo nginx -t
curl -I localhost
clear
ls -la /var/www/html
clear
hostname
history
cat ~/.bash_history
history -a
```

## Additional Deployment Work

The following activities were also completed during the assignment. They are documented separately because they were not present in the saved Bash history:

* Created `/var/www/shopbondhu` as the website document root.
* Created CSS and JavaScript directories.
* Uploaded the frontend HTML, CSS, and JavaScript files.
* Configured the Nginx server block.
* Enabled the ShopBondhu Nginx site.
* Disabled the default Nginx site.
* Tested the Nginx configuration using `nginx -t`.
* Reloaded Nginx.
* Verified homepage, CSS, and JavaScript responses using curl.
* Verified the website through the EC2 public IPv4 address.

## Verification

* Nginx service: Active and running.
* Nginx configuration test: Successful.
* Local HTTP response: HTTP 200 OK.
* Public website: Successfully accessible during testing.

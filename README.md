Create a web server for IoT project. 
server: 
	+ compile post.c to post executable file then cp to /usr/lib/cgi-bin
	+ copy (or edit) serve-cgi-bin file into /etc/apache2/conf-available
	+ restart apache2: systemctl restart apache2
client:
	+ check ip of orangepi when connect to wifi (use putty-serial and nmcli command), with orangepi not recommend(!?) modify wpa_supllicant.conf for auto connect when startup

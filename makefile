git:
	clear
	git fetch
	git add .
	git commit -m "Update"
	git merge origin/master
	git push -u origin master
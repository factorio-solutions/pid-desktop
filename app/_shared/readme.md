# In this repository are stored shared resources for pid-desktop and pid-mobile
### How to setup subtree connection?
```git
<<<<<<< HEAD
git remote add pid-shared https://gitlab.com/ondrej.fiala/pid-shared.git
=======
git remote add pid-shared https://github.com/factorio-solutions/pid-shared.git
>>>>>>> feature/new_api
git subtree add --prefix=app/_shared/ pid-shared master
```

### How to push changes to the subtree?
```git
git subtree push --prefix=app/_shared/ pid-shared master
<<<<<<< HEAD
and accept push request in GitLab website
=======
>>>>>>> feature/new_api
```

### How to pull changes from subtree?
```git
git subtree pull --prefix=app/_shared/ pid-shared master
```

### For PID-mobile the codes are as follows
```git
<<<<<<< HEAD
git remote add pid-shared https://gitlab.com/ondrej.fiala/pid-shared.git
git subtree add --prefix=src/_shared/ pid-shared master

git subtree push --prefix=src/_shared/ pid-shared master
and accept push request in GitLab website

git subtree pull --prefix=src/_shared/ pid-shared master
```
=======
git remote add pid-shared https://github.com/factorio-solutions/pid-shared.git
git subtree add --prefix=src/_shared/ pid-shared master

git subtree push --prefix=src/_shared/ pid-shared master

git subtree pull --prefix=src/_shared/ pid-shared master
```
>>>>>>> feature/new_api

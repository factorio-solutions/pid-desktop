# In this repository are stored shared resources for pid-desktop and pid-mobile
### How to setup subtree connection?
```git
git remote add pid-shared https://gitlab.com/ondrej.fiala/pid-shared.git
git subtree add --prefix=app/_shared/ pid-shared master
```

### How to push changes to the subtree?
```git
git subtree push --prefix=app/_shared/ pid-shared master
and accept push request in GitLab website
```

### How to pull changes from subtree?
```git
git subtree pull --prefix=app/_shared/ pid-shared master
```

### For PID-mobile the codes are as follows
```git
git remote add pid-shared https://gitlab.com/ondrej.fiala/pid-shared.git
git subtree add --prefix=src/_shared/ pid-shared master

git subtree push --prefix=src/_shared/ pid-shared master
and accept push request in GitLab website

git subtree pull --prefix=src/_shared/ pid-shared master
```
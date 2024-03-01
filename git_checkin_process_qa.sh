#!/bin/bash
git checkout $1
git branch
git pull origin $1
git checkout qa
git branch
git pull origin qa
git merge $1
git push origin qa


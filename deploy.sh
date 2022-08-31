#!/bin/bash

tag=$1

if [ -z "$tag" ]
then
    echo "tag required"
    return
fi

git add .
git commit -m "$tag"
git tag "$tag"
git push
git push --tag
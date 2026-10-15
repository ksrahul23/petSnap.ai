#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

gdown "https://drive.google.com/file/d/1ocDQxsd6FJrVyaJNPnTOH9Ae9G9LglYr/view?usp=drive_link" -O best_catdog_model.pth

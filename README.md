# Billed Project

![HTML](https://img.shields.io/badge/Language-HTML-orange)
![CSS](https://img.shields.io/badge/Language-CSS-purple)
![JavaScript](https://img.shields.io/badge/Language-JS-yellow)
![JEST](https://img.shields.io/badge/Language-JEST-green)

## About
Billed is a company that produces Saas solutions for human resources teams. The objective was to take an already existing code in order to debug it. Then, we had to write integration tests and unit tests with JavaScript and write a manual end-to-end test plan.

## How to run the application
This project is linked with a Back-End API service which is here : https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

- First, run the Back-end by following instructions in the previous link.
- Then, go to the right folder :
```shell 
$ cd Billed-app-FR-Front
```
- Install npm packages :
```shell 
$ npm install
```
- Install live-server :
```shell 
$ npm install -g live-server
```
- Run the application :
```shell 
$ live-server
```
- Go to this URL : http://127.0.0.1:8080/

## How to run tests with Jest
```shell 
$ npm run test
```

## Admins and Users accounts
### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```
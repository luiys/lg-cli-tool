 ```
  _     ____        ____ _     ___    _____ ___   ___  _     
 | |   / ___|      / ___| |   |_ _|  |_   _/ _ \ / _ \| |    
 | |  | |  _ _____| |   | |    | |_____| || | | | | | | |    
 | |__| |_| |_____| |___| |___ | |_____| || |_| | |_| | |___ 
 |_____\____|      \____|_____|___|    |_| \___/ \___/|_____|

 ```

A Cli to generate node boilerplates

![npm](https://img.shields.io/npm/v/lg-cli-tool?style=flat-square)&nbsp;&nbsp;&nbsp;
![npm](https://img.shields.io/npm/dt/lg-cli-tool?style=flat-square)&nbsp;&nbsp;&nbsp;
![GitHub issues](https://img.shields.io/github/issues/luiys/lg-cli-tool?style=flat-square)&nbsp;&nbsp;&nbsp;
![NPM](https://img.shields.io/npm/l/lg-cli-tool?style=flat-square)&nbsp;&nbsp;&nbsp;

# Installation

```shell
npm install -g lg-cli-tool
```
or
```shell
yarn global add lg-cli-tool
```

# Usage

```shell
Usage: lg-cli-tool [options] [command]

CLI to create node projects with express and typeorm

Options:
  -v, --version   show the current CLI version      
  -h, --help      display help for command

Commands:
  init [options]  Create a node project
  generate [options] <schematic>  generate template files
  help [command]  display help for command
```

## init command

This command will make you some questions about what you want in your nodejs express project.

```shell
lg-cli-tool init 
```

## generate command

This command will create a template schematic for you.

Schematic options: 'controller' and 'entities'

### controller

**Very important**

The dir of controller generation always will be: **src/modules**/< ControllerModuleName >/< ControllerName >, so you dont need to write 'src/modules' every time
It will create a very simple controller template with the name prompted, and instantiate it in the controller index file under src/modules
The folder and the controller's name do not need to have neither 'Controller' nor '.ts', the CLI will do it for you

```shell
lg-cli-tool generate controller --dir ControllerModuleName/ControllerName
```
### entities

Using the db credentials in .env file and connection.ts, this command will generate entities like the CLI does in init command

```shell
lg-cli-tool generate entities
```



> Coming soon for react and react-native
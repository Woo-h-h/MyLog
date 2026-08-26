@echo off
set "JAVA_HOME=D:\Java JDK"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0"
call mvnw.cmd spring-boot:run -Dmaven.test.skip=true

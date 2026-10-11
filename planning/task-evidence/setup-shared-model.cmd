@echo off
setlocal
if /I "%~1"=="--help" (
  echo Usage: setup-shared-model.cmd "D:\path\to\BotHarness"
  echo Starts the shared model wizard with Git for Windows Bash, without WSL.
  echo Use --check to check Bash syntax without starting setup.
  exit /b 0
)
set "AX_GIT_BASH=%ProgramFiles%\Git\bin\bash.exe"
if not exist "%AX_GIT_BASH%" (
  echo Git for Windows Bash was not found at "%AX_GIT_BASH%".
  echo Install Git for Windows, or run setup-shared-model.sh in Git Bash.
  exit /b 1
)
if /I "%~1"=="--check" (
  "%AX_GIT_BASH%" -n "%~dp0setup-shared-model.sh"
  exit /b
)
"%AX_GIT_BASH%" "%~dp0setup-shared-model.sh" "%~1"
exit /b %ERRORLEVEL%

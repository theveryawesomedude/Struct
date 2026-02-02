@echo off
REM ===============================
REM Struct Batch Shim for Windows
REM Located in shm folder
REM ===============================

REM Check Node.js exists
where node >nul 2>&1
IF ERRORLEVEL 1 (
    echo Node.js is required but not found.
    exit /b 1
)

REM Check if at least one file is passed
IF "%~1"=="" (
    echo Usage: struct file1.struct [file2.struct ...]
    exit /b 1
)

REM Loop through all files
:LOOP
IF "%~1"=="" GOTO END

REM Check if file exists
IF NOT EXIST "%~1" (
    echo File not found: "%~1"
    shift
    GOTO LOOP
)

REM Run interpreter for this file
echo Running Struct: "%~1"
node "%~dp0\..\binaries\rt.exe" "%~1"
echo ----------------------------
shift
GOTO LOOP

:END
exit /b 0

# file-manager

## Description

The file manager able to do the following:

- Work using CLI
- Perform basic file operations (copy, move, delete, rename, etc.)
- Utilize Streams API
- Get information about the host machine operating system
- Perform hash calculations
- Compress and decompress files

## Work with Program

- The program is started by npm-script `start` in following way:
```bash
npm run start -- --username=your_username
```
- After program work finished (`ctrl + c` pressed or user sent `.exit` command into console) the program displays the following text in the console
`Thank you for using File Manager, Username, goodbye!`
- In case of unknown operation or invalid input (missing mandatory arguments, wrong data in arguments, etc.) `Invalid input` message will show and user should be able to enter another command
- In case of error during execution of operation `Operation failed` message will show and user should be able to enter another command (e.g. attempt to perform an operation on a non-existent file or work on a non-existent path)
- User can't go upper than root directory. If user tries to do so, current working directory doesn't change

### List of operations and their syntax:

- Navigation & working directory (nwd)
    - Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
    ```bash
    up
    ```
    - Go to dedicated folder from current directory (`path_to_directory` should be relative or absolute)
    ```bash
    cd path_to_directory
    ```
    - Print in console list of all files and folders in current directory
    ```bash
    ls
    ```

- Basic operations with files
    - Read file and print it's content in console (implement with Readable stream):
    ```bash
    cat path_to_file
    ```
    - Create empty file in current working directory:
    ```bash
    add new_file_name
    ```
    - Rename file:
    ```bash
    rn path_to_file new_filename
    ```
    - Copy file (implemented with Readable and Writable streams, if ```path_to_new_directory``` doesn't exist you get ```Operation failed```):
    ```bash
    cp path_to_file path_to_new_directory
    ```
    - Move file (implemented with Readable and Writable streams, if ```path_to_new_directory``` doesn't exist you get ```Operation failed):
    ```bash
    mv path_to_file path_to_new_directory
    ```
    - Delete file:
    ```bash
    rm path_to_file
    ```
- Operating system info (prints following information in console)
    - Get EOL (default system End-Of-Line) and print it to console
    ```bash
    os --EOL
    ```
    - Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
    ```bash
    os --cpus
    ```
    - Get home directory and print it to console
    ```bash
    os --homedir
    ```
    - Get current *system user name* and print it to console
    ```bash
    os --username
    ```
    - Get CPU architecture for which Node.js binary has compiled and print it to console
    ```bash
    os --architecture
    ```
- Hash calculation
    - Calculate hash for file and print it into console
    ```bash
    hash path_to_file
    ```
- Compress and decompress operations
    - Compress file (implemented with Brotli algorithm and Streams API)
    ```bash
    compress path_to_file path_to_destination
    ```
    - Decompress file (implemented with Brotli algorithm and Streams API)
    ```bash
    decompress path_to_file path_to_destination
    ```

### P.S:

- if you want to use file_name or file_path with whitespace please apply quotes for it, for example:

    ```
      cd c:/Users/'User name'
      add ./'new text document.txt'
      rn c:/Users/'User name'/'new text document.txt' 'text document.txt'
    ```
- ```path_to_destination```  in ```compress/decompress``` commands, it's a path to directory, you don't need write a file_name after name_directory:

    ```
      compress ./document.txt ./
      // result should be document.txt.br

      rm ./document.txt
      decompress ./document.txt.br ./
      // result should be document.txt
    ```

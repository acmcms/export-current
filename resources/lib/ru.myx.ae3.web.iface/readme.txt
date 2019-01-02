to add root user:

calc "username = console.readString('Enter username'), password = console.readPassword('Enter password'), undefined"
ae3 auth add $username
ae3 auth addGroup admin
ae3 auth addMembership $username admin
ae3 auth passwd $username --login $username $password
calc "delete username; delete password;"
import time

# All of this is customizable, and is the bulk of the customization. This will most likely be moved to a config file.

MAXIMUM_SECONDS = 1
EXPIRATION_SECONDS = 1
DIFF = 1
PREFIX_PROMPT = "what is a man? a miserable pile of secrets?"

CODE_PROGRESS = 1
CODE_PASS = 1
CODE_FAIL = 1

CERT_COOKIE = "expires_on"

# The domain, port, whatever of the website you are doing this to. 
# Trailing slash is required
TARGET_SITE = ''


with open('.config', 'r') as FILE:
    for LL in FILE:
        line = str(LL)
        sh = line.split()
        if line[:len('MAXIMUM_SECONDS')] == 'MAXIMUM_SECONDS':
            MAXIMUM_SECONDS = int(sh[2])
        if line[:len('EXPIRATION_SECONDS')] == 'EXPIRATION_SECONDS':
            EXPIRATION_SECONDS = int(sh[2])
        if line[:len('DIFF')] == 'DIFF':
            DIFF = int(sh[2])
        if line[:len('PREFIX_PROMPT')] == 'PREFIX_PROMPT':
            PREFIX_PROMPT = line[len('PREFIX_PROMPT = '):].strip()
        if line[:len('CODE_PROGRESS')] == 'CODE_PROGRESS':
            CODE_PROGRESS = int(sh[2])
        if line[:len('CODE_PASS')] == 'CODE_PASS':
            CODE_PASS = int(sh[2])
        if line[:len('CODE_FAIL')] == 'CODE_FAIL':
            CODE_FAIL = int(sh[2])
        if line[:len('TARGET_SITE')] == 'TARGET_SITE':
            TARGET_SITE = line[len('TARGET_SITE = '):].strip()

        
print("CONFIG")
print("MAXIMUM_SECONDS:", MAXIMUM_SECONDS)
print("DIFF:", DIFF)
print("PREFIX_PROMPT:", PREFIX_PROMPT)
print("CODE_PROGRESS:", CODE_PROGRESS)
print("CODE_PASS:", CODE_PASS)
print("CODE_FAIL:", CODE_FAIL)
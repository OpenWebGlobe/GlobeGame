#!c:\python27\python.exe
# Author: Robert Wueest, robert.wueest@fhnw.ch
#
# (c) 2013 by FHNW University of Applied Sciences and Arts Northwestern Switzerland
################################################################################

import sys
import os
import json
import shutil

#from subprocess import call
#call(["ls", "-l"])


f = open("settings.json", 'r')
s_settings = f.read()
f.close()

settings = json.loads(s_settings)

#if len(sys.argv) < 2:
#   print('usage:\n')
#   print('--target url')
#   print('--user username')
#   print('--pass password')
#   print('--sshkey keyfile')
#   sys.exit()

bTarget = 0;
bUser = 0;
bPass    = 0;
bSSH     = 0;

target = ""
username = ""
password = ""
sshkey = ""

for i in range(1,len(sys.argv)):
   if not(sys.argv[i].startswith('--')):
      if bTarget == 1:
         target = sys.argv[i]
      if bUser == 1:
         username = sys.argv[i]
      if bPass == 1:
         password = sys.argv[i]
      if bSSH == 1:
         sshkey = sys.argv[i] 
   if sys.argv[i] == ('--target'):
      bTarget = 1
      bUser = 0
      bPass    = 0
      bSSH     = 0
   if sys.argv[i] == ('--user'):
      bTarget = 0
      bUser = 1
      bPass    = 0
      bSSH     = 0
   if sys.argv[i] == ('--pass'):
      bTarget = 0
      bUser = 0
      bPass    = 0
      bSSH     = 1
   if sys.argv[i] == ('--sshkey'):
      bTarget = 0
      bUser = 0
      bPass    = 0
      bSSH     = 1
      
fileList = []

for i in range(0,len(settings["deployment"]["files"])):
   #print settings["deployment"]["files"][i]
   fileList.append(settings["deployment"]["files"][i])
   
   
for h in range(0,len(settings["deployment"]["folders"])):
   #print settings["deployment"]["folders"][h]
   rootdir = settings["deployment"]["folders"][h]
   for root, subFolders, files in os.walk(rootdir):
      for file in files:
         f = os.path.join(root,file)
         fileList.append(f)

for j in range(0,len(fileList)):
   if not os.path.exists('tmp/'+os.path.dirname(fileList[j])):
      os.makedirs('tmp/'+os.path.dirname(fileList[j]))
   shutil.copy(fileList[j], 'tmp/'+fileList[j])

print "\n".join(fileList)
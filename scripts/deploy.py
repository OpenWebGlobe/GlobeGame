################################################################################
#!/usr/bin/python
# python deployment
################################################################################
# Author: Robert Wueest, robert.wueest@fhnw.ch
#
# (c) 2013 by FHNW University of Applied Sciences and Arts Northwestern Switzerland
################################################################################

import sys
import os
import json
import shutil
from subprocess import call

target = ""
username = ""
host = ""
sshkey = ""
platform = "linux"
method = "local"

os.chdir("../")


f = open("settings.json", 'r')
s_settings = f.read()
f.close()
settings = json.loads(s_settings)

bTarget = 0;
bUser    = 0;
bHost    = 0;
bSSH     = 0;
bPlatform = 0;
bMethod = 0;



################################################################################
# Params
################################################################################
for i in range(1,len(sys.argv)):
   if not(sys.argv[i].startswith('--')):
      if bTarget == 1:
         target = sys.argv[i]
      if bUser == 1:
         username = sys.argv[i]
      if bHost == 1:
         host = sys.argv[i]
      if bSSH == 1:
         sshkey = sys.argv[i] 
      if bPlatform == 1:
         platform = sys.argv[i]
      if bMethod == 1:
         method = sys.argv[i] 
   if sys.argv[i] == ('-t'):
      bTarget = 1
      bUser = 0
      bHost    = 0
      bSSH     = 0
      bPlatform     = 0
      bMethod     = 0
   if sys.argv[i] == ('-u'):
      bTarget = 0
      bUser = 1
      bHost    = 0
      bSSH     = 0
      bPlatform     = 0
      bMethod     = 0
   if sys.argv[i] == ('-h'):
      bTarget = 0
      bUser = 0
      bHost    = 1
      bSSH     = 0
      bPlatform     = 0
      bMethod     = 0
   if sys.argv[i] == ('-i'):
      bTarget = 0
      bUser = 0
      bHost    = 0
      bSSH     = 1
      bPlatform     = 0
      bMethod     = 0
   if sys.argv[i] == ('-p'):
      bTarget = 0
      bUser = 0
      bHost    = 0
      bSSH     = 0
      bPlatform     = 1
      bMethod     = 0
   if sys.argv[i] == ('-m'):
      bTarget = 0
      bUser = 0
      bHost    = 0
      bSSH     = 0
      bPlatform  = 0
      bMethod     = 1

################################################################################
# Test params
################################################################################
if len(target) == 0 or ((method == "scp" or method == "ftp") and (len(user) == 0 or len(sshkey) == 0 or len(host) == 0)):
   print('usage:\n')
   print('-p platform (win/default:linux)')
   print('-u username')
   print('-h hostaddress')
   print('-t targetpath')
   print('-i keyfile')
   print('-m method (ftp/scp/default:local)')
   sys.exit()
      
fileList = []


################################################################################
# Generate file list
################################################################################
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

cmdparams = " -i "+sshkey+" -r tmp "+username+"@"+host+":"+target

################################################################################
# Prepare and execute deployment procedure
################################################################################
if method == "local":
   if os.path.exists(target):
      shutil.rmtree(target+"/")
   for j in range(0,len(fileList)):
      if not os.path.exists(target+'/'+os.path.dirname(fileList[j])):
         os.makedirs(target+'/'+os.path.dirname(fileList[j]))
      shutil.copy(fileList[j], target+'/'+fileList[j]) 
else:
   for k in range(0,len(fileList)):
      if not os.path.exists('tmp/'+os.path.dirname(fileList[k])):
         os.makedirs('tmp/'+os.path.dirname(fileList[k]))
      shutil.copy(fileList[k], 'tmp/'+fileList[k])
   if platform == "linux":
      print "Platform: linux\n"
      if method == "scp":
         call(["scp", cmdparams])
   elif platform == "windows":
      print "Platform: windows\n"
   shutil.rmtree("tmp/")

################################################################################
# Feedback
################################################################################
print "\n Copy: ".join(fileList)
print "\n"+str(len(fileList))+" Files copied!"
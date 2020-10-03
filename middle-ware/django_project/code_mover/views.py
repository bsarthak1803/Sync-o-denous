from django.http import HttpResponse, HttpResponseServerError
import tempfile
import json
import git
import ftplib
import glob
import time
import ast
import os
import shutil


def code_mover(request):
    if request.method == "POST":
        a = request.body.decode("utf-8")
        data = json.loads(a)
        print (data)
        repo_avl = data['radio1']
        from_repo_loc = data['repo_loc']
        to_local_loc = data['local_loc']
        if os.name == 'nt':
            to_local_loc = to_local_loc.replace('/','\\')
        if os.path.isdir(to_local_loc):
            shutil.rmtree(to_local_loc, onerror=handleError)
        if repo_avl == "Yes":
            folder_name = data['subfold']
            try:
                print(to_local_loc+folder_name)
                repo = git.Repo.clone_from(from_repo_loc, to_local_loc)
                print("Repository cloned")
            except Exception:
                return HttpResponse("Directory is not empty!!",content_type='text/plain')
                time.sleep(5)
                exit()
            Branch_name = data['branch']
            try:
                repo.git.checkout(Branch_name)
                print("Branch Changed")
            except Exception:
                return HttpResponse("Branch does not exist!!",content_type='text/plain')
                time.sleep(5)
                exit()

        files_list = []
        files_list2 = []
        files_list3 = []
        prefix = data['prefix']
        if repo_avl == "Yes":
            print ()
            for i in glob.glob(to_local_loc + folder_name + "/*.prg"):
                find_var = i.find("lh")
                find_var2 = i.find(".prg")
                files_list.append(i)
                files_list2.append(prefix + i[find_var:])
                files_list3.append(i[find_var:find_var2])
            for i in glob.glob(to_local_loc + folder_name + "/*.inc"):
                files_list.append(i)
                files_list2.append(prefix + i[i.find("lh"):])
                files_list3.append(i[i.find("lh"):])
        else:
            for i in glob.glob(to_local_loc + "/*.prg"):
                find_var = i.find("lh")
                find_var2 = i.find(".prg")
                files_list.append(i)
                files_list2.append(prefix + i[find_var:])
                files_list3.append(i[find_var:find_var2])
            for i in glob.glob(to_local_loc + "/*.inc"):
                files_list.append(i)
                files_list2.append(prefix + i[i.find("lh"):])
                files_list3.append(i[i.find("lh"):])

        sub_dir_option = data['radio2']
        sub_dir_name = data['subdir']
        domain_conn_string = data['domain']
        folder = data['folder']
        username = data['username']
        password = data['password']
        if sub_dir_option == "Yes":
            try:
                ftp = ftplib.FTP(domain_conn_string)
            except Exception:
                return HttpResponse("Invalid Connection String!!",content_type='text/plain')
                time.sleep(5)
                exit()
            try:
                print(ftp.login(username, password))
            except Exception:
                return HttpResponse("Login Unsuccessful!!",content_type='text/plain')
                time.sleep(5)
                exit()
            try:
                print(ftp.cwd('/cerner/'+folder+'/ccluserdir/'))
                # print (sub_dir_name)
                if sub_dir_name in ftp.nlst():
                    print(ftp.cwd(sub_dir_name),"  to ", sub_dir_name)
                else:
                    print("New directory created: ", sub_dir_name)
                    ftp.mkd(sub_dir_name)
                    ftp.sendcmd('SITE CHMOD 777 ' + sub_dir_name)
                    print(ftp.cwd(sub_dir_name))
            except Exception:
                return HttpResponse("Directory not found!!",content_type='text/plain')
                time.sleep(5)
                exit()
        else:
            try:
                ftp = ftplib.FTP(domain_conn_string)
            except Exception:
                return HttpResponse("Invalid Connection String!!",content_type='text/plain')
                time.sleep(5)
                exit()
            try:
                print(ftp.login(username, password))
            except Exception:
                return HttpResponse("Login Unsuccessful!!",content_type='text/plain')
                time.sleep(5)
                exit()
            try:
                print(ftp.cwd('/cerner/'+folder+'/ccluserdir/'))
            except Exception:
                return HttpResponse("Directory not found!!",content_type='text/plain')
                time.sleep(5)
                exit()
        for i in range(0, len(files_list2)):
            new_file = tempfile.TemporaryFile()
            file2 = open(files_list[i], "rb")

            for line in file2:
                if str.encode(":dba") in line:
                    line = line.replace(str.encode(":dba"), str.encode(""))
                    for j in files_list3:
                        if str.encode(j) in line:
                            line = line.replace(str.encode(j), str.encode(prefix + j))
                elif str.encode("%i cclsource") in line and str.encode("%i cclsource:status_block.inc") not in line:
                    if sub_dir_option == "Yes":
                        line = line.replace(str.encode("%i cclsource"), str.encode("%i ccluserdir/" + sub_dir_name))
                    else:
                        line = line.replace(str.encode("%i cclsource"), str.encode("%i ccluserdir"))
                    for j in files_list3:
                        if str.encode(j) in line:
                            line = line.replace(str.encode(j), str.encode(prefix + j))

                for j in files_list3:
                    if str.encode(j) in line and (str.encode("EXECUTE") in line or str.encode("execute") in line):
                        line = line.replace(str.encode(j), str.encode(prefix + j))

                new_file.write(line)
            new_file.seek(0)
            ftp.storbinary('STOR ' + files_list2[i], new_file)
            ftp.sendcmd('SITE CHMOD 777 ' + files_list2[i])
            new_file.close()
            file2.close()

        print("Files entered!!")
        ftp.close()
        return HttpResponse("Files entered Successfully!!",content_type='text/plain')

    else:
        return HttpResponse("some other method")

def handleError(func, path):
    # Check if file access issue
    if not os.access(path, os.W_OK):
        # Try to change the permision of file
        os.chmod(path, stat.S_IWUSR)
        # call the calling function again
        func(path)

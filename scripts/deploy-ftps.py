import os, sys, pathlib
from ftplib import FTP_TLS
import ssl, hashlib

HOST = "rh7.neoserv.si"
USER = os.environ["FTP_USER"]
PASS = os.environ["FTP_PASS"]
LOCAL = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".output/public").resolve()

ctx = ssl.create_default_context()
ftp = FTP_TLS(context=ctx)
ftp.connect(HOST, 21, timeout=60)
ftp.auth()
ftp.prot_p()
ftp.login(USER, PASS)
print("Connected+TLS as", USER, "PWD:", ftp.pwd())

def ensure_dir(path):
    parts = [p for p in path.split("/") if p]
    cur = ""
    for p in parts:
        cur += "/" + p
        try:
            ftp.mkd(cur)
        except Exception:
            pass

uploaded, skipped = 0, 0

def walk(local: pathlib.Path, remote: str):
    global uploaded, skipped
    for item in sorted(local.iterdir()):
        rpath = f"{remote}/{item.name}" if remote else item.name
        if item.is_dir():
            ensure_dir(rpath)
            walk(item, rpath)
        else:
            data = item.read_bytes()
            with open(item, "rb") as f:
                ftp.storbinary(f"STOR {rpath}", f, blocksize=32768)
            uploaded += 1
            if uploaded % 100 == 0:
                print(f"  {uploaded} files...", flush=True)

print(f"Uploading {LOCAL} -> /")
walk(LOCAL, "")
print(f"DONE: {uploaded} files uploaded")
ftp.quit()

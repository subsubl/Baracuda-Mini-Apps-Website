import os
import sys
from ftplib import FTP

FTP_HOST = "ftp.dronko.si"
FTP_PORT = 21
FTP_USER = "baracuda@dronko.si"
FTP_PASS = "Vpzgn10p.,"
LOCAL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.output/public"))

def upload_dir(ftp, local_path, remote_path):
    print(f"📁 Syncing directory: {remote_path or '/'}")
    for item in sorted(os.listdir(local_path)):
        local_item = os.path.join(local_path, item)
        remote_item = f"{remote_path}/{item}" if remote_path else item

        if os.path.isdir(local_item):
            try:
                ftp.mkd(remote_item)
                print(f"  [+] Created directory: {remote_item}")
            except Exception:
                pass # Already exists
            upload_dir(ftp, local_item, remote_item)
        else:
            print(f"  [↑] Uploading: {remote_item}")
            with open(local_item, "rb") as f:
                ftp.storbinary(f"STOR {remote_item}", f)

def main():
    print(f"🚀 Connecting to Production FTP server {FTP_HOST}:{FTP_PORT} as {FTP_USER}...")
    try:
        ftp = FTP()
        ftp.connect(FTP_HOST, FTP_PORT, timeout=30)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.set_pasv(True)
        print("✅ FTP Authentication successful!")

        upload_dir(ftp, LOCAL_DIR, "")
        print("🎉 Production FTP deployment finished successfully!")
        ftp.quit()
    except Exception as e:
        print(f"❌ Error during FTP deployment: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

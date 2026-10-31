import os
import hashlib

def create_seed_files():
    seed_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "seed_files"))
    os.makedirs(seed_dir, exist_ok=True)

    # 1. Valid minimal JPEG (drift)
    jpeg_header = (
        b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00"
        b"\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08"
        b"\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00"
        b"\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xbf\x00\xff\xd9"
    )
    drift_path = os.path.join(seed_dir, "seed_field_photo_drift.jpg")
    with open(drift_path, "wb") as f:
        f.write(jpeg_header)

    # Alias matching seed_evidence.json original_filename
    alias_path = os.path.join(seed_dir, "IMG_20260615_Seeding_DSR.jpg")
    with open(alias_path, "wb") as f:
        f.write(jpeg_header)

    # 2. Valid minimal JPEG (in-boundary)
    in_bound_path = os.path.join(seed_dir, "seed_field_photo_in_boundary.jpg")
    with open(in_bound_path, "wb") as f:
        f.write(jpeg_header + b"_IN_BOUNDARY_MARKER")

    # 3. Valid CSV (irrigation log)
    csv_content = (
        "date,activity,method,flow_rate_lps,duration_hours,water_volume_m3\n"
        "2026-06-10,pre_sowing_irrigation,submersible_pump,12.5,4.0,180.0\n"
    )
    csv_path = os.path.join(seed_dir, "seed_irrigation_log.csv")
    with open(csv_path, "w", encoding="utf-8") as f:
        f.write(csv_content)

    # 4. Valid PDF (declaration)
    pdf_content = (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n"
        b"xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n"
        b"0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n186\n%%EOF\n"
    )
    pdf_path = os.path.join(seed_dir, "seed_declaration.pdf")
    with open(pdf_path, "wb") as f:
        f.write(pdf_content)

    print("Generated seed files successfully in:", seed_dir)
    for fname in os.listdir(seed_dir):
        fpath = os.path.join(seed_dir, fname)
        with open(fpath, "rb") as f:
            h = hashlib.sha256(f.read()).hexdigest()
        print(f"  {fname}: {h}")

if __name__ == "__main__":
    create_seed_files()

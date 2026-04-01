import subprocess
import sys

def run_seed(file_name):
    print(f"\nRunning {file_name}...")

    try:
        subprocess.run([sys.executable, file_name], check=True)
        print(f"{file_name} finished successfully")

    except subprocess.CalledProcessError:
        print(f"{file_name} failed to run")
        print("Something went wrong while executing this seed file.")
        print("Check the error message above.")
        sys.exit(1)

    except Exception as e:
        print(f"Unexpected error in {file_name}: {e}")
        sys.exit(1)


run_seed("seed_users.py")
run_seed("seed_recipes.py")
run_seed("seed_items.py")
run_seed("seed_ingredients.py")

print("\nAll seeds completed!")
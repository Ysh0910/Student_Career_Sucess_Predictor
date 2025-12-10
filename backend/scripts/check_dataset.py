"""
Quick script to check dataset columns and structure.
"""
import pandas as pd
import sys

csv_path = 'data/student_career_data.csv'

try:
    print("Loading dataset...")
    df = pd.read_csv(csv_path)
    
    print(f"\n✓ Dataset loaded successfully!")
    print(f"Total records: {len(df)}")
    print(f"\nColumns in dataset:")
    print("=" * 60)
    for i, col in enumerate(df.columns, 1):
        print(f"{i}. {col}")
    
    print("\n" + "=" * 60)
    print("\nFirst few rows:")
    print(df.head())
    
    print("\n" + "=" * 60)
    print("\nData types:")
    print(df.dtypes)
    
    print("\n" + "=" * 60)
    print("\nBasic statistics:")
    print(df.describe())
    
except FileNotFoundError:
    print(f"Error: File not found at {csv_path}")
    print("Please ensure the dataset is placed in backend/data/student_career_data.csv")
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()

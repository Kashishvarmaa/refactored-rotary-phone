import csv

def csv_to_txt(csv_filename, txt_filename):
    # Open the CSV file and the TXT file
    with open(csv_filename, mode='r', newline='', encoding='utf-8') as csv_file, open(txt_filename, mode='w', encoding='utf-8') as txt_file:
        csv_reader = csv.reader(csv_file)
        
        # Loop through each row in the CSV
        for row in csv_reader:
            # Convert the row to a string, join with commas and write to the TXT file
            txt_file.write(','.join(row) + '\n')

# Example usage
csv_to_txt('data.csv', 'output.txt')
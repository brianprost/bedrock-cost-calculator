import sys
from openpyxl import load_workbook
import tiktoken

models = [
    "mistral.mistral-7b-instruct-v0:2",
    "mistral.mixtral-8x7b-instruct-v0:1",
    "mistral.mistral-large-2402-v1:0",
    "meta.llama3-8b-instruct-v1:0",
    "meta.llama3-70b-instruct-v1:0",
]

prices = {
    "mistral.mistral-7b-instruct-v0:2": {
        "input": 0.00015,
        "output": 0.0002,
    },
    "mistral.mixtral-8x7b-instruct-v0:1": {
        "input": 0.00045,
        "output": 0.0007,
    },
    "mistral.mistral-large-2402-v1:0": {
        "input": 0.008,
        "output": 0.024,
    },
    "meta.llama3-8b-instruct-v1:0": {
        "input": 0.0004,
        "output": 0.0006,
    },
    "meta.llama3-70b-instruct-v1:0": {
        "input": 0.00265,
        "output": 0.0035,
    },
}


def get_model_price(model_name: str, num_tokens: int, in_or_out: str) -> float:
    """
    Returns the price of the model given the number of tokens.
    """
    if model_name not in prices:
        raise ValueError(f"Invalid model name: {model_name}")

    price = num_tokens / 1000 * prices[model_name][in_or_out]
    return price


def count_tokens(text, encoding):
    if text is None:
        return 0
    else:
        return len(encoding.encode(str(text)))


def main():
    """
    Main function that loads an XLSX file, counts the total number of tokens,
    and calculates the price for each model.
    """
    if len(sys.argv) != 2:
        print("Usage: python script.py <xlsx_file>")
        sys.exit(1)

    file_path = sys.argv[1]
    if not file_path.endswith(".xlsx"):
        print("Input file must be an XLSX file.")
        sys.exit(1)

    try:
        workbook = load_workbook(file_path, read_only=True, data_only=True)
        total_tokens = 0
        encoding = tiktoken.get_encoding("cl100k_base")

        for sheet in workbook:
            sheet_tokens = 0
            for row in sheet.rows:
                for cell in row:
                    sheet_tokens += count_tokens(cell.value, encoding)
            total_tokens += sheet_tokens

        print(f"Total number of tokens: {total_tokens}")

        for model in models:
            price = get_model_price(model, total_tokens, "input")
            print(f"Price for {model}: ${price:.2f}")

    except FileNotFoundError:
        print(f"File not found: {sys.argv[1]}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


if __name__ == "__main__":
    main()

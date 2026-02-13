from src import pow
import datetime

SEP = "___"

def generate_prefix(PROMPT = "what is a man? a miserable pile of secrets?"):
    prefix = PROMPT
    timestamp = datetime.datetime.now(datetime.timezone.utc)
    prefix += SEP + str(timestamp) + SEP
    return (prefix, timestamp)


if __name__ == "__main__":
    prefix = generate_prefix()

    solution = pow.sath.solve(prefix)
    check = pow.sath.verify(prefix, solution)
    hash = pow.sath.get_digest(prefix, solution)
    print(prefix, "\n", solution, "\n", hash, "\n", check)

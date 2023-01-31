"""
comp.cs.100
Tekijä: Jami Kulmala
Opiskelijanumero: 150425043
"""

def main():
    tiedostonimi = input("Enter the name of the score file: ")
    tiedosto = open(tiedostonimi, mode="r")
    nimilista = tiedosto.readlines()

    for i in sorted(nimilista):
        print(i)


    tiedosto.close()


if __name__ == "__main__":
    main()
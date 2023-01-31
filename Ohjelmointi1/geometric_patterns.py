"""
comp.cs.100
Tekijä: Jami Kulmala
Opiskelijanumero: 150425043
"""

import math

def count_rectangle(a, b):
    """ laskee suorakulmion pinta alan ja piirin
    :param a: sivu 1
    :param b: sivu 2
    """
    result1 = a * 2 + b * 2
    result2 = a * b
    print(f"The circumference is {result1:.2f}")
    print(f"The surface area is {result2:.2f}")


def count_square(s):
    """Laskee ne neliön pinta alan ja piirin
    :param s: sivun pituus
    """
    result1 = 4 * s
    result2 = s * s
    print(f"The circumference is {result1:.2f}")
    print(f"The surface area is {result2:.2f}")


def count_circle(c):
    """ Laskee ymypyrän pinta alan ja piirin
    :param c: säde
    """
    result1 = 2 * math.pi * c
    result2 = math.pi * c ** 2
    print(f"The circumference is {result1:.2f}")
    print(f"The surface area is {result2:.2f}")


def square_input(sq):
    """ sivun pituus
    :param sq: input
    :return: s, float
    """
    s = float(input(sq))
    return s

def rectangle_input(re):
    """ sivun pituus
    :param re: input
    :return: r, float
    """
    r = float(input(re))
    return r

def circle_input(ci):
    """ Ympyrän säde
    :param ci: input
    :return: c, float
    """
    c = float(input(ci))
    return c

def poistu():
    """
    stops the program and prints goodbye
    """
    return print("Goodbye!")

def menu():
    """
    Print a menu for user to select which geometric pattern to use in calculations.
    """
    while True:
        answer = input("Enter the pattern's first letter or (q)uit: ")


        while answer == "s":
            s = square_input("Enter the length of the square's side: ")

            if s <= 0:
                continue

            if s > 0:
                count_square(s)
                break


        while answer == "r":
            a = rectangle_input("Enter the length of the rectangle's side 1: ")

            if a <= 0:
                continue

            b = rectangle_input("Enter the length of the rectangle's side 2: ")

            while b <= 0:
                b = rectangle_input("Enter the length of the rectangle's side 2: ")
                continue


            if a > 0 and b > 0:
                count_rectangle(a, b)
                break


        while answer == "c":
            c = circle_input("Enter the circle's radius: ")

            if c <= 0:
                continue

            if c > 0:
                count_circle(c)
                break


        if answer == "q":
            poistu()
            break

        if answer not in ("s", "r", "c", "q"):
            print("Incorrect entry, try again!")

        # Empty row for the sake of readability.
        print()

def main():
    menu()

if __name__ == "__main__":
    main()

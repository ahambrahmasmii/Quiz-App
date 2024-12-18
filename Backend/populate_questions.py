import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quiz_backend.settings')
django.setup()


from quiz.models import Question

questions_data = [
    {"question_text": "What is the capital of France?", "option_a": "Berlin", "option_b": "Madrid", "option_c": "Paris", "option_d": "Rome", "correct_option": "C"},
    {"question_text": "Who wrote 'Hamlet'?", "option_a": "Charles Dickens", "option_b": "J.K. Rowling", "option_c": "William Shakespeare", "option_d": "Mark Twain", "correct_option": "C"},
    {"question_text": "Which planet is known as the Red Planet?", "option_a": "Earth", "option_b": "Mars", "option_c": "Jupiter", "option_d": "Venus", "correct_option": "B"},
    {"question_text": "What is the largest ocean on Earth?", "option_a": "Atlantic", "option_b": "Indian", "option_c": "Pacific", "option_d": "Arctic", "correct_option": "C"},
    {"question_text": "What is the square root of 64?", "option_a": "6", "option_b": "7", "option_c": "8", "option_d": "9", "correct_option": "C"},
    {"question_text": "Who painted the Mona Lisa?", "option_a": "Van Gogh", "option_b": "Leonardo da Vinci", "option_c": "Picasso", "option_d": "Michelangelo", "correct_option": "B"},
    {"question_text": "What is the chemical symbol for water?", "option_a": "H2O", "option_b": "O2", "option_c": "CO2", "option_d": "NaCl", "correct_option": "A"},
    {"question_text": "What is the smallest prime number?", "option_a": "0", "option_b": "1", "option_c": "2", "option_d": "3", "correct_option": "C"},
    {"question_text": "Who discovered penicillin?", "option_a": "Marie Curie", "option_b": "Alexander Fleming", "option_c": "Isaac Newton", "option_d": "Louis Pasteur", "correct_option": "B"},
    {"question_text": "What is the speed of light?", "option_a": "300,000 km/s", "option_b": "150,000 km/s", "option_c": "400,000 km/s", "option_d": "200,000 km/s", "correct_option": "A"},
    # Add 10 more questions...
]

for question in questions_data:
    Question.objects.create(
        question_text=question["question_text"],
        option_a=question["option_a"],
        option_b=question["option_b"],
        option_c=question["option_c"],
        option_d=question["option_d"],
        correct_option=question["correct_option"],
    )

print(f"Added {len(questions_data)} questions to the database.")

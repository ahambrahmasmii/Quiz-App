import random
from django.http import JsonResponse
from .models import Question
from django.views.decorators.csrf import csrf_exempt
import json



def start_quiz(request):
    # Fetch 5 random questions
    questions = list(Question.objects.all())
    random.shuffle(questions)
    selected_questions = questions[:5]
    response = [
        {
            "id": q.id,
            "question_text": q.question_text,
            "options": {
                "A": q.option_a,
                "B": q.option_b,
                "C": q.option_c,
                "D": q.option_d,
            },
        }
        for q in selected_questions
    ]
    return JsonResponse({"questions": response})


@csrf_exempt
def submit_quiz(request):
    if request.method == "POST":
        try:
            # Parse the request body
            data = json.loads(request.body)
            user_answers = data.get("answers", {})
            # user_answers = json.loads(request.body)  # Directly parse the key-value pairs
            
            results = []
            correct_count = 0

            for question_id, user_answer in user_answers.items():
                # Fetch the question by ID
                question = Question.objects.get(id=question_id)
                
                # Map the options to their corresponding text
                options_map = {
                    "A": question.option_a,
                    "B": question.option_b,
                    "C": question.option_c,
                    "D": question.option_d,
                }
                
                # Get the user's answer and the correct answer as text
                user_answer_text = options_map.get(user_answer, "Invalid Option")
                correct_answer_text = options_map.get(question.correct_option, "Invalid Option")
                
                # Check if the user's answer is correct
                is_correct = question.correct_option == user_answer
                if is_correct:
                    correct_count += 1
                
                # Append the result for this question
                results.append({
                    "question": question.question_text,
                    "user_answer": user_answer_text,
                    "correct_answer": correct_answer_text,
                    "is_correct": is_correct,
                })

            # Return the response with the results
            return JsonResponse({
                "correct_count": correct_count,
                "total_questions": len(user_answers),
                "results": results,
            })

        except Question.DoesNotExist:
            return JsonResponse({"error": "Invalid question ID provided"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # Handle invalid request methods
    return JsonResponse({"error": "Invalid request method"}, status=400)

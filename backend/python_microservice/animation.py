from manim import *
import random

class MyScene(Scene):
    def construct(self):
        title = Text("What is Machine Learning?", font_size=48).to_edge(UP)
        data_points = VGroup(*[Circle(radius=0.2).set_color(BLUE).move_to(LEFT*2 + UP*2 + RIGHT*random.uniform(-1, 1) + DOWN*random.uniform(-1, 1)) for _ in range(10)]).add(*[Square(side_length=0.4).set_color(RED).move_to(RIGHT*2 + UP*2 + RIGHT*random.uniform(-1, 1) + DOWN*random.uniform(-1, 1)) for _ in range(10)])
        model_line = Line(LEFT*3, RIGHT*3).set_color(GREEN).shift(DOWN*0.5)
        decision_text = Text("Decision Boundary", font_size=24).next_to(model_line, DOWN)

        self.play(Write(title))
        self.wait(0.5)
        self.play(LaggedStart(*[FadeIn(point) for point in data_points], lag_ratio=0.1))
        self.wait(1)

        self.play(Create(model_line), Write(decision_text))
        self.wait(1)

        new_line = Line(LEFT*3 + UP*1, RIGHT*3 - UP*1).set_color(GREEN)
        self.play(Transform(model_line, new_line))
        self.wait(1)

        training_text = Text("Training Process", font_size=36).to_edge(UP)
        self.play(Transform(title, training_text))

        value = ValueTracker(0)
        update_line = always_redraw(lambda: Line(LEFT*3 + (value.get_value() - 0.5)*UP, RIGHT*3 - (value.get_value() - 0.5)*UP).set_color(GREEN))
        self.play(Transform(model_line, update_line))

        for angle in [25, 20, 15, 12, 10]:
            value.set_value(angle/10)
            self.wait(0.5)

        ml_concepts = VGroup(
            Text("Supervised Learning", font_size=24),
            Text("Neural Networks", font_size=24),
            Text("Loss Minimization", font_size=24)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.5).next_to(model_line, UP, buff=1)

        self.play(FadeIn(ml_concepts))
        self.wait(2)
        self.play(FadeOut(model_line), FadeOut(decision_text), ml_concepts.animate.shift(DOWN*2))

        final_text = Text("Machine Learning = Patterns in Data + Optimization", font_size=32).set_color(YELLOW).shift(UP*0.5)
        self.play(Write(final_text))
        self.wait(3)

scene = MyScene()
scene.render()
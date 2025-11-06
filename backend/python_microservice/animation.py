
from manim import *

class IntroductionToNeuralNetwork(Scene):
    def construct(self):
        # Animating the nodes
        nodes = VGroup(*[Circle(radius=0.1, color=WHITE) for _ in range(10)])
        nodes.set_fill(opacity=0)
        self.add(nodes)
        self.play(AnimationGroup(*[FadeIn(node) for node in nodes], lag_ratio=0.1, run_time=2))
        self.wait(0.5)

        # Narrator voiceover and transition to brain diagram
        text = Text("Imagine a network of interconnected nodes, each node processing and transmitting information to others.").scale(1.2)
        self.play(text.animate.shift(UP * 3))
        self.wait(0.5)
        self.play(FadeOut(nodes), FadeOut(text), run_time=0.5)
        brain_diagram = SVGMobject("brain_diagram.svg").scale(0.6).set_opacity(0.8)
        self.play(FadeIn(brain_diagram), run_time=2)

        # Narrator voiceover and transition to simple neural network diagram
        text = Text("Inspired by the human brain, neural networks are a type of machine learning model that consists of multiple layers of interconnected nodes or 'neurons.'").scale(1.2)
        self.play(text.animate.shift(DOWN * 3), brain_diagram.animate.shift(DOWN * 3))
        self.wait(0.5)
        self.play(FadeOut(text), run_time=0.5)
        simple_neural_network = VGroup(
            VGroup(
                Rectangle(width=2, height=1, color=WHITE),
                Line(UP * 2, DOWN * 2, color=WHITE)
            ).to_edge(LEFT),
            VGroup(
                Rectangle(width=2, height=1, color=WHITE),
                Line(UP * 2, DOWN * 2, color=WHITE)
            ).next_to(VGroup(Rectangle(width=2, height=1, color=WHITE), Line(UP * 2, DOWN * 2, color=WHITE)), RIGHT),
            VGroup(
                Rectangle(width=2, height=1, color=WHITE),
                Line(UP * 2, DOWN * 2, color=WHITE)
            ).to_edge(RIGHT)
        )
        self.play(FadeIn(simple_neural_network), run_time=2)

        # Narrator voiceover and transition to neural network in action
        text = Text("Each node receives one or more inputs, performs a computation, and sends the output to one or more other nodes. This layered structure allows the network to learn complex patterns and relationships.").scale(1.2)
        self.play(text.animate.shift(DOWN * 3), simple_neural_network.animate.shift(DOWN * 3))
        self.wait(0.5)
        self.play(FadeOut(text), run_time=0.5)
        self.play(simple_neural_network.animate.to_edge(UP), run_time=1)

        # Narrator voiceover and transition to neural network applications
        neural_network_application = VGroup(
            Rectangle(width=4, height=2, color=WHITE).shift(LEFT * 2),
            Rectangle(width=2, height=1, color=WHITE).next_to(Rectangle(width=4, height=2, color=WHITE), LEFT),
            Rectangle(width=2, height=1, color=WHITE).next_to(Rectangle(width=2, height=1, color=WHITE), DOWN)
        )
        text = Text("Neural networks have revolutionized many fields, including computer vision, natural language processing, and speech recognition.").scale(1.2)
        self.play(FadeIn(neural_network_application), text.animate.shift(UP * 3))
        self.wait(0.5)
        self.play(FadeOut(text), run_time=0.5)
        self.play(FadeOut(neural_network_application), run_time=1)

        # Narrator voiceover and closing shot
        self.play(FadeOut(simple_neural_network), run_time=1)
        text = Text("In summary, neural networks are a powerful tool for machine learning, inspired by the human brain and capable of processing complex information.").scale(1.2)
        self.play(text.animate.shift(DOWN * 3))
        end_screen = Text("Neural Network Basics").scale(1.5).shift(UP * 2.5)
        self.play(FadeIn(end_screen), text.animate.shift(DOWN * 2))
        self.wait(2)

        # Fade to black
        self.play(FadeOut(VGroup(text, end_screen, brain_diagram, simple_neural_network, neural_network_application, self.camera.frame)), run_time=2)

EXECUTABLE_SCENE = "IntroductionToNeuralNetwork"
